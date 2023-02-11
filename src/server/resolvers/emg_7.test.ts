import type { IStreamDatabase } from '@typings';

import { IEmg7Raw, Emg7Resolver } from './emg_7';

describe('resolvers/emg_7', () => {
    let stream: IStreamDatabase;

    let result: IEmg7Raw;

    let resolver: Emg7Resolver;
    let fetch: jest.Mock<Promise<IEmg7Raw>>;

    beforeEach(() => {
        stream = {
            canResolveTrack: true,
            trackUrl: 'url',
        } as IStreamDatabase;

        resolver = new Emg7Resolver(stream);

        result = {
            playlist: [
                {
                    artist: {
                        id: false,
                        name: 'playlist.0.artist.name',
                    },
                    duration: 40,
                    id: 789,
                    song: {
                        id: false,
                        name: 'playlist.0.song.name',
                    },
                    start_ts: 100,
                    dbid: 1,
                },
            ],
            date: '',
            ts: 100
        } as IEmg7Raw;

        // @ts-expect-error protected
        resolver.fetch = fetch = jest.fn();

        fetch.mockResolvedValue(result);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Таких данных здесь нет
    it.skip('should return track with image', () => {
    });

    it('should return track without image', async() => {
        await expect(resolver.get()).resolves.toEqual({
            artist: 'playlist.0.artist.name',
            title: 'playlist.0.song.name',
            image: null,
            endTime: 140,
        });
    });

    it('should return undefined if playlist is empty', async() => {
        result.playlist = [];

        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
