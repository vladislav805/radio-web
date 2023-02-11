import type { ICurrentTrack } from '@typings';

import { Resolver } from '../Resolver';

export interface IEuropaPlusRaw {
    data: {
        id: number;
        raw?: {
            artist: string;
            name: string;
        },
        song_id: number;
        name: string;
        time_start: string; // ISO date
        duration: number;
        image: string;
        hook: string;
        artists: {
            artist_id: number;
            artist: string;
            slug: string;
            link: string;
            prefix: string;
            active: boolean;
            sort: number;
        }[];
        singers_names: string;
        singers_links: string; // html
        itunes: {
            artist: string;
            song: string;
            image: string;
            file: string;
        }
    }[];
}

export class EmgEuropaPlusResolver extends Resolver<IEuropaPlusRaw> {
    protected transform(result: IEuropaPlusRaw): ICurrentTrack | undefined {
        const track = result.data[0];

        if (!track) return undefined;

        const started = Math.floor(+new Date(track.time_start) / 1000);
        const endTime = started + track.duration;

        return {
            artist: track.raw?.artist ?? track.artists.map(a => a.artist).join(', '),
            title: track.raw?.name ?? track.name,
            image: track.image ?? null,
            endTime,
        };
    }
}
