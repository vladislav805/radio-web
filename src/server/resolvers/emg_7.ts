import { Resolver } from '@server/Resolver';
import type { ICurrentTrack } from '@typings';

interface IEmg7Raw {
    playlist: {
        id: number,
        dbid: number;
        artist: {
            id: number | false,
            name: string;
        };
        song: {
            id: number | false;
            name: string;
        };
        start_ts: number;
        duration: number;
    }[];
    online: {
        time_start: string;
        time_stop: string;
        start_ts: number;
        stop_ts: number;
        program:{
            title: string;
            link: boolean;
        };
        staff: never[];
        hash: string;
    };
    date: string;
    ts: number;
}

export class Emg7Resolver extends Resolver<IEmg7Raw> {
    public override transform(result: IEmg7Raw): ICurrentTrack | undefined {
        const track = result.playlist?.[0];

        if (!track) return undefined;

        const endTime = track.start_ts + track.duration;

        return {
            artist: track.artist.name,
            title: track.song.name,
            image: null,
            endTime,
        };
    }
}
