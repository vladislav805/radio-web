import { Resolver } from '../Resolver';
import type { ICurrentTrack } from '@typings';

interface IDfmRaw {
    [key: string]: {
        current_track: {
            id: string;
            name: string;
            picture: {
                id: string;
                url_absolute: string;
                url_relative: string;
            } | null;
            song_artist: string;
            song_title: string;
        };
        playlist: [];
    }
}

interface IDfmArguments {
    id: string;
}

export class DfmResolver extends Resolver<IDfmRaw, IDfmArguments> {
    public override transform(result: IDfmRaw, args: IDfmArguments): ICurrentTrack | undefined {
        if (!args || !args.id) return undefined;

        const stream = result[args.id];
        if (!stream) return undefined;

        const track = stream.current_track;

        return {
            artist: track.song_artist,
            title: track.song_title ?? track.name,
            image: track.picture?.url_absolute ?? null,
            endTime: null,
        };
    }
}
