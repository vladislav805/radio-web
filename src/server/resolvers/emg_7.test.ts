import type { IStreamDatabase } from '@typings';

import { type IEmg7Raw, Emg7Resolver } from './emg_7';

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
            data: [
                {
                    singer: 'playlist.0.artist.name',
                    duration: 40,
                    id: 789,
                    song: 'playlist.0.song.name',
                    startedAt: '',
                    image: '',
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
            endTime: NaN,
        });
    });

    it('should return undefined if data is empty', async() => {
        result.data = [];

        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
