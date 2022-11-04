import { Resolver } from '@server/Resolver';
import type { ICurrentTrack } from '@typings';

interface IRecordRaw {
    result: {
        id: number;
        track: {
            id: number;
            artist: string;
            song: string;
            image100?: string;
            image200?: string;
            image600?: string;
            listenUrl: string;
            itunesUrl: string;
            itunesId: string;
            noFav: boolean;
            noShow: boolean;
            shareUrl: string;
        }
    }[];
}

interface IRecordResolverArguments {
    id: number;
}

// Иногда в пикче возвращается относительный путь к картинке. Эта картинка всегда указывает на "отсутствующий cover-image"
const DEFAULT_IMAGE = 'DefaultTrack';

export class RecordResolver extends Resolver<IRecordRaw, IRecordResolverArguments> {
    public override transform(result: IRecordRaw, args: IRecordResolverArguments): ICurrentTrack | undefined {
        if (!args || !args.id) return undefined;

        const targetId = args.id;

        const info = result.result.find(stream => stream.id === targetId);

        if (info == undefined) return undefined;

        const track = info.track;

        let image: string | null = track.image600 ?? track.image200 ?? track.image100 ?? null;

        if (image?.includes(DEFAULT_IMAGE)) {
            image = null;
        }

        return {
            artist: track.artist,
            title: track.song,
            image,
            endTime: null,
        };
    }
}
