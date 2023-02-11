import type { IStreamDatabase } from '@typings';

import { IEuropaPlusRaw, EmgEuropaPlusResolver } from './europaplus';

describe('resolvers/europaplus', () => {
    let stream: IStreamDatabase;

    let result: IEuropaPlusRaw;

    let resolver: EmgEuropaPlusResolver;
    let fetch: jest.Mock<Promise<IEuropaPlusRaw>>;

    beforeEach(() => {
        stream = {
            canResolveTrack: true,
            trackUrl: 'url',
        } as IStreamDatabase;

        resolver = new EmgEuropaPlusResolver(stream);

        result = {
            data: [{
                id: 'data.0.id',
                name: 'data.0.name',
                raw: {
                    artist: 'data.0.raw.artist',
                    name: 'data.0.raw.name',
                },
                time_start: '2023-02-11T22:00:00.000Z', // 1676152800
                duration: 40,
                artists: [{
                    artist: 'data.0.artists.0.artist',
                }, {
                    artist: 'data.0.artists.1.artist',
                }],
            } as unknown as IEuropaPlusRaw['data'][number]],
        };

        // @ts-expect-error protected
        resolver.fetch = fetch = jest.fn();

        fetch.mockResolvedValue(result);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return track with image', async() => {
        result.data[0].image = 'data.0.image';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'data.0.raw.artist',
            title: 'data.0.raw.name',
            image: 'data.0.image',
            endTime: 1676152840,
        });
    });

    it('should return track without image', async() => {
        await expect(resolver.get()).resolves.toEqual({
            artist: 'data.0.raw.artist',
            title: 'data.0.raw.name',
            image: null,
            endTime: 1676152840,
        });
    });

    it('should return track info if raw not specified', async() => {
        result.data[0].raw = undefined;

        await expect(resolver.get()).resolves.toEqual({
            artist: 'data.0.artists.0.artist, data.0.artists.1.artist',
            title: 'data.0.name',
            image: null,
            endTime: 1676152840,
        });
    });

    it('should return undefined if playlist is empty', async() => {
        result.data.length = 0;
        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
