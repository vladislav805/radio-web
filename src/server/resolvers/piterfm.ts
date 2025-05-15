import type { ICurrentTrack } from '@typings';

import { Resolver } from '../Resolver';

export interface IPiterFmRaw {
    adnow: number;
    msItem: string;
    items: {
        startdate: string; // 2022-11-05
        starttime: string; // 01:33:20
        track: {
            artist: {
                name: string;
            };
            name: string;
            duration: string; // 00:04:11
            imgsmall?: string;
            imglarge?: string;
        };
    }[];
}

export class PiterFmResolver extends Resolver<IPiterFmRaw> {
    protected override transform(result: IPiterFmRaw): ICurrentTrack | undefined {
        if (result.adnow) {
            return {
                artist: 'Питер FM',
                title: 'Реклама',
                endTime: null,
                image: null,
            };
        }

        const item = result.items?.[0];

        if (!item) return undefined;

        const { startdate, starttime, track } = item;

        const startDate = new Date(`${startdate}T${starttime}+03:00`);

        const endTime = Math.floor(Number(startDate) / 1000) + this.parseDuration(track.duration);

        return {
            artist: track.artist.name,
            title: track.name,
            image: track.imglarge ?? track.imgsmall ?? null,
            endTime,
        };
    }

    protected parseDuration(time: string): number {
        const [h, m, s] = time.split(':');

        return Number(h) * 3600 + Number(m) * 60 + Number(s);
    }
}
