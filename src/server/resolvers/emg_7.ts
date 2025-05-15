import type { ICurrentTrack } from '@typings';

import { Resolver } from '../Resolver';

export interface IEmg7Raw {
    data: IEmg7Track[];
}

export interface IEmg7Track {
    id: number;
    singer: string;
    song: string;
    image: string;
    startedAt: string;
    duration: number;
}

export class Emg7Resolver extends Resolver<IEmg7Raw> {
    protected override transform(result: IEmg7Raw): ICurrentTrack | undefined {
        const row = result?.data?.[0];

        if (row === undefined) {
            return undefined;
        }

        const {
            singer: artist,
            song: title,
            startedAt,
            duration,
        } = row;

        const endTimeMs = new Date(startedAt).getTime() + (duration * 2) * 1000;

        if (
            title === undefined ||
            artist === undefined
        ) {
            return undefined;
        }

        const image = row.image !== '' ? row.image : null;
        const endTime = Math.floor(endTimeMs / 1000);

        return { artist, title, image, endTime };
    }
}
