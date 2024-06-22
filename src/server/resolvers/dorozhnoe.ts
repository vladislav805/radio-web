import axios from 'axios';

import { Resolver } from '@server/Resolver';
import { leadZero } from '../../lib/leadZero';
import type { ICurrentTrack } from '@typings';

interface IDorozhnoeRaw {
    title: string;
    head_tags: unknown[];
    content: string;
}

interface IDorozhnoeArguments {
    channel: string;
    region?: string;
}

export class DorozhnoeResolver extends Resolver<IDorozhnoeRaw, IDorozhnoeArguments> {
    protected override async fetch(args: IDorozhnoeArguments): Promise<IDorozhnoeRaw | undefined> {
        if (!args || !args.channel) return undefined;

        const now = new Date();
        const date = `${leadZero(now.getDate())}.${leadZero(now.getMonth() + 1)}.${now.getFullYear()}`;
        const hour = now.getHours();
        const start = `${leadZero(hour)}:00`;
        const end = `${leadZero(hour + 1)}:00`; // 24:00 - валидно

        const params = new URLSearchParams({
            'filter[channel]': args.channel,
            'filter[date]': date,
            'filter[time_start]': start,
            'filter[time_end]': end,
            __ajax__: '1',
        });

        if (args.region) {
            params.set('region', args.region);
        }

        const { data } = await axios.get(`https://dorognoe.ru/radio-station/playlist?${params.toString()}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
                'X-Requested-With': 'XMLHttpRequest',
                Referrer: 'https://dorognoe.ru/radio-station/playlist',
            },
        });

        return data as IDorozhnoeRaw;
    }

    protected override transform(result: IDorozhnoeRaw, args: IDorozhnoeArguments | undefined): ICurrentTrack | undefined {
        if (!args || !args.channel || !result) return undefined;

        const html = result.content.replace(/\n/img, '').replace(/\s{2,}/img, '');

        const rowResult = /<tr>(.*?)<\/tr>/mg.exec(html);

        if (!rowResult) return undefined;

        const row = rowResult[0];

        const image = this.getImage(row);
        const artist = this.getArtist(row);
        const title = this.getTitle(row);

        if (title === undefined || artist === undefined) return undefined;

        return { artist, title, image, endTime: null };
    }

    protected static readonly DEFAULT_IMAGE = 'no_img_music';

    protected static readonly RE_IMAGE = /<img src="([^"]+)" width="300/gm;
    protected static readonly RE_ARTIST = /<td class="artist"><a href="[^"]+">([^<]+)<\/a>/gm;
    protected static readonly RE_TITLE = /<td class="track-title">(.*?)<\/td>/gm;

    protected getImage(html: string): string | null {
        const res = DorozhnoeResolver.RE_IMAGE.exec(html);

        if (res === null || res[1].includes(DorozhnoeResolver.DEFAULT_IMAGE)) return null;

        return `https://dorognoe.ru${res[1]}`;
    }

    protected getArtist(html: string): string | undefined {
        const res = DorozhnoeResolver.RE_ARTIST.exec(html);

        if (res === null) return undefined;

        return res[1];
    }

    protected getTitle(html: string): string | undefined {
        const res = DorozhnoeResolver.RE_TITLE.exec(html);

        if (res === null) return undefined;

        return res[1].replace(/<a href="[^"]+">([^<]+)<\/a>/img, '$1');
    }

    protected override destruct() {
        super.destruct();

        DorozhnoeResolver.RE_IMAGE.lastIndex = 0;
        DorozhnoeResolver.RE_ARTIST.lastIndex = 0;
        DorozhnoeResolver.RE_TITLE.lastIndex = 0;
    }
}
