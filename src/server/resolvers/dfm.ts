import type { ICurrentTrack } from '@typings';

import { Resolver } from '../Resolver';

export interface IDfmRaw {
    success: boolean;
    result: {
        status: 'Ok';
        data: IDfmTrack[];
    };
}

export interface IDfmTrack {
    id: string;
    artist: string;
    title: string;
    cover: string;
}

export class DfmResolver extends Resolver<IDfmRaw> {
    protected override transform(result: IDfmRaw): ICurrentTrack | undefined {
        if (!result.success || result.result?.status !== 'Ok' || !Array.isArray(result.result.data)) {
            return undefined;
        }

        const track = result.result.data[0];

        return {
            artist: track.artist,
            title: track.title,
            image: track.cover ? `https://dfm.ru${track.cover}` : null,
            endTime: null,
        };
    }
}
