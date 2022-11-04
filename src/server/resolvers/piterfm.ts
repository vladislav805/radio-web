import { Resolver } from '@server/Resolver';
import type { ICurrentTrack } from '@typings';

interface IPiterFmRaw {
    adnow: number;
    msItem: string;
    items: {
        track: string;
        artist: string;
        duration: string; // 00:04:11
        startdate: string; // 2022-11-05
        starttime: string; // 01:33:20
        imgsmall: string;
        imglarge: string;
    }[];
}
export class PiterFmResolver extends Resolver<IPiterFmRaw> {
    public override transform(result: IPiterFmRaw): ICurrentTrack | undefined {
        if (result.adnow) {
            return {
                artist: 'Питер FM',
                title: 'Реклама',
                endTime: null,
                image: null,
            };
        }

        const track = result.items?.[0];

        if (!track) return undefined;

        const startDate = new Date(`${track.startdate}T${track.starttime}+03:00`);

        const endTime = Number(startDate) + this.parseDuration(track.duration);

        return {
            artist: track.artist,
            title: track.track,
            image: track.imglarge ?? track.imgsmall,
            endTime,
        };
    }

    protected parseDuration(time: string): number {
        const [h, m, s] = time.split(':');

        return Number(h) * 3600 + Number(m) * 60 + Number(s);
    }
}
