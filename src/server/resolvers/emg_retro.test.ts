import type { IStreamDatabase } from '@typings';

import { type IRetroRaw, EmgRetroResolver } from './emg_retro';

describe('resolvers/emg_retro', () => {
    let stream: IStreamDatabase;

    let result: IRetroRaw;

    let resolver: EmgRetroResolver;
    let fetch: jest.Mock<Promise<IRetroRaw>>;

    beforeEach(() => {
        stream = {
            canResolveTrack: true,
            trackUrl: 'url',
        } as IStreamDatabase;

        resolver = new EmgRetroResolver(stream);

        result = [{
            id: '1',
            name: 'name',
            start: '100',
            duration: '40',
            artist_txt: 'artist_txt',
        }] as IRetroRaw;

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
            artist: 'artist_txt',
            title: 'name',
            image: null,
            endTime: 140,
        });
    });

    it('should return undefined if playlist is empty', async() => {
        result.length = 0;

        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
