import type { IStreamDatabase } from '@typings';

import { type IPiterFmRaw, PiterFmResolver } from './piterfm';

describe('resolvers/piterfm', () => {
    let stream: IStreamDatabase;

    let result: IPiterFmRaw;

    let resolver: PiterFmResolver;
    let fetch: jest.Mock<Promise<IPiterFmRaw>>;

    beforeEach(() => {
        stream = {
            canResolveTrack: true,
            trackUrl: 'url',
        } as IStreamDatabase;

        resolver = new PiterFmResolver(stream);

        result = {
            adnow: 0,
            msItem: '',
            items: [{
                track: 'items.0.track',
                artist: 'items.0.artist',
                duration: '00:04:11',
                startdate: '2022-11-05',
                starttime: '01:33:20',
            }],
        };

        // @ts-expect-error protected
        resolver.fetch = fetch = jest.fn();

        fetch.mockResolvedValue(result);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return track with image', async() => {
        result.items[0].imgsmall = 'items.0.imgsmall';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'items.0.artist',
            title: 'items.0.track',
            image: 'items.0.imgsmall',
            endTime: 1667601451,
        });

        result.items[0].imglarge = 'items.0.imglarge';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'items.0.artist',
            title: 'items.0.track',
            image: 'items.0.imglarge',
            endTime: 1667601451,
        });
    });

    it('should return track without image', async() => {
        await expect(resolver.get()).resolves.toEqual({
            artist: 'items.0.artist',
            title: 'items.0.track',
            image: null,
            endTime: 1667601451,
        });
    });

    it('should return "Реклама" during advertisement', async() => {
        result.adnow = 1;

        await expect(resolver.get()).resolves.toEqual({
            artist: 'Питер FM',
            title: 'Реклама',
            image: null,
            endTime: null,
        });
    });

    it('should return undefined if playlist is empty', async() => {
        result.items.length = 0;
        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
