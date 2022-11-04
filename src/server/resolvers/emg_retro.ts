import { Resolver } from '@server/Resolver';
import type { ICurrentTrack } from '@typings';

type IRetroRaw = {
    id: string; // int
    name: string;
    artist: string; // html!
    start: string; // unixtime
    duration: string; // int
    dbid: string;
    artist_txt: string;
    song_id: string; // int
    mp3_link: string;
}[];

export class EmgRetroResolver extends Resolver<IRetroRaw> {
    public override transform(result: IRetroRaw): ICurrentTrack | undefined {
        const track = result[0];

        if (!track) return undefined;

        const endTime = Number(track.start) - Number(track.duration);

        return {
            artist: track.artist_txt,
            title: track.name,
            image: null,
            endTime,
        };
    }
}
