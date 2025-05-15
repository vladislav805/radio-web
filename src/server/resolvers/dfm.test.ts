import type { IStreamDatabase } from '@typings';

import { type IDfmRaw, DfmResolver } from './dfm';

describe('resolvers/dfm', () => {
    let stream: IStreamDatabase;

    let result: IDfmRaw;

    let resolver: DfmResolver;
    let fetch: jest.Mock<Promise<IDfmRaw>>;

    beforeEach(() => {
        stream = {
            canResolveTrack: true,
            trackUrl: 'url',
        } as IStreamDatabase;

        resolver = new DfmResolver(stream);

        result = {
            success: true,
            result: {
                status: 'Ok',
                data: [{
                    id: 'id',
                    title: 'song_title',
                    cover: '/picture.webp',
                    artist: 'song_artist',
                }],
            },
        };

        // @ts-expect-error protected
        resolver.fetch = fetch = jest.fn();

        fetch.mockResolvedValue(result);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return track with image', async() => {
        await expect(resolver.get()).resolves.toEqual({
            artist: 'song_artist',
            title: 'song_title',
            image: 'https://dfm.ru/picture.webp',
            endTime: null,
        });
    });

    it('should return track without image', async() => {
        result.result.data[0].cover = '';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'song_artist',
            title: 'song_title',
            image: null,
            endTime: null,
        });
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
