import axios from 'axios';

import { Resolver } from '@server/Resolver';
import { leadZero } from '../../lib/leadZero';
import type { ICurrentTrack } from '@typings';

interface IDorozhnoeRaw {
    data: IDorozhnoeTrack[];
}

interface IDorozhnoeTrack {
    id: number;
    singer: string;
    song: string;
    image: string;
    startedAt: string;
    duration: number;
}

interface IDorozhnoeArguments {
    channel: string;
    region?: string;
}

export class DorozhnoeResolver extends Resolver<IDorozhnoeRaw, IDorozhnoeArguments> {
    protected override async fetch(args: IDorozhnoeArguments): Promise<IDorozhnoeRaw | undefined> {
        if (!args || !args.channel) return undefined;

        const now = new Date();
        const date = `${now.getFullYear()}-${leadZero(now.getMonth() + 1)}-${leadZero(now.getDate())}`;
        const hour = now.getHours();

        const params = new URLSearchParams({
            channel: args.channel,
            start: `${date} ${leadZero(hour)}:00:00`,
            stop: `${date} ${leadZero(hour + 1)}:00:00`, // 24:00 - валидно
            limit: '10',
        });

        const { data } = await axios.get(`https://api.dorognoe.ru/api/playlists?${params.toString()}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
                'X-Requested-With': 'XMLHttpRequest',
                Referrer: 'https://api.dorognoe.ru/api/playlists',
            },
        });

        return data as IDorozhnoeRaw;
    }

    protected override transform(result: IDorozhnoeRaw, args: IDorozhnoeArguments | undefined): ICurrentTrack | undefined {
        if (!args || !args.channel || !result) return undefined;

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

        const endTimeMs = new Date(startedAt).getTime() + (duration * 1.5) * 1000;

        if (
            title === undefined ||
            artist === undefined
        ) {
            return undefined;
        }

        // Бывает так, что в списке нет текущего трека, а первый - такой, который был 10 минут назад
        if (endTimeMs < Date.now()) {
            return undefined;
        }

        const image = row.image !== '' ? row.image : null;
        const endTime = Math.floor(endTimeMs / 1000);

        return { artist, title, image, endTime };
    }
}
