import type { RowDataPacket } from 'mysql2';

import { getConnection } from '@server/db';
import type { IStation, IStream } from '@typings';

type Item = Pick<IStation, 'stationId' | 'title'> & Pick<IStream, 'streamId' | 'url' | 'noReferrer'> & { noReferer: 1 | null };

enum StreamErrorReason {
    HTTP_CODE = 'HTTP_CODE',
    TIMEOUT = 'TIMEOUT',
}

function stringifyItem({ title, stationId, streamId }: Item): string {
    return `${title} (stationId=${stationId}, streamId=${streamId})`;
}

class StreamError extends Error {
    public constructor(
        public readonly reason: StreamErrorReason,
        protected readonly item: Item,
        public readonly httpCode: number | null,
        protected readonly withReferer: boolean,
    ) {
        super('Check station failed');
    }

    public toString(): string {
        const reason = this.getReason();

        return `FAILED: ${stringifyItem(this.item)} failed${this.withReferer ? ' with referer' : ''} ${reason}`.trim();
    }

    private getReason(): string {
        switch (this.reason) {
            case StreamErrorReason.HTTP_CODE: {
                return `(HTTP_CODE=${this.httpCode})`;
            }

            case StreamErrorReason.TIMEOUT: {
                return '(TIMEOUT)';
            }
        }

        return '';
    }
}

async function checkAudioURL(item: Item, withReferer: boolean): Promise<boolean> {
    const abortCtl = new AbortController();

    try {
        const headers: HeadersInit = {};

        if (withReferer) {
            headers.Referer = 'https://domain1.com/';
        }

        const request = await fetch(item.url, {
            signal: abortCtl.signal,
        });

        abortCtl.abort();

        if (request.status !== 200) {
            throw new StreamError(StreamErrorReason.HTTP_CODE, item, request.status, withReferer);
        }
    } catch (e) {
        throw new StreamError(StreamErrorReason.TIMEOUT, item, null, withReferer);
    }

    return true;
}

interface IResultError {
    stationId: number;
    streamId: number;
    withReferer: boolean;
    httpCode: number | null;
    reason: StreamErrorReason;
}

export async function checkAll(_props: {}): Promise<boolean> {
    const connect = await getConnection();

    const [stations] = await connect.execute('select `station`.`stationId`, `stream`.`streamId`, `station`.`title`, `stream`.`url`, `stream`.`trackUrl`, `stream`.`noReferrer` from `stream` left join `station` on `station`.`stationId` = `stream`.`stationId`');

    const errors: IResultError[] = [];

    for (const station of Array.from(stations as RowDataPacket[]) as Item[]) {
        for (const withReferer of [false, true]) {
            try {
                await checkAudioURL(station, withReferer);

                console.log(`OK: ${stringifyItem(station)}`);
            } catch (error) {
                console.log(error instanceof StreamError ? error.toString() : (error as Error).message);

                if (error instanceof StreamError) {
                    errors.push({
                        stationId: station.stationId,
                        streamId: station.streamId,
                        httpCode: error.httpCode,
                        reason: error.reason,
                        withReferer,
                    });
                }
            }
        }
    }

    console.log(errors);

    return true;
}
