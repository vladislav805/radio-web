import type { IStreamDatabase } from '@typings';

import { IRecordRaw, RecordResolver } from './record';

describe('resolvers/record', () => {
    let stream: IStreamDatabase;

    let result: IRecordRaw;

    let resolver: RecordResolver;
    let fetch: jest.Mock<Promise<IRecordRaw>>;

    beforeEach(() => {
        stream = {
            canResolveTrack: true,
            trackUrl: 'url',
            resolverArguments: '{"id":123}',
        } as IStreamDatabase;

        resolver = new RecordResolver(stream);

        result = {
            result: [{
                id: 123,
                track: {
                    id: 456,
                    artist: 'result.0.track.artist',
                    song: 'result.0.track.song',
                    listenUrl: 'result.0.track.listenUrl',
                    itunesUrl: 'result.0.track.itunesUrl',
                    itunesId: 'result.0.track.itunesId',
                    noFav: false,
                    noShow: false,
                    shareUrl: '',
                }
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
        result.result[0].track.image100 = 'result.0.track.image100';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'result.0.track.artist',
            title: 'result.0.track.song',
            image: 'result.0.track.image100',
            endTime: null,
        });

        result.result[0].track.image200 = 'result.0.track.image200';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'result.0.track.artist',
            title: 'result.0.track.song',
            image: 'result.0.track.image200',
            endTime: null,
        });

        result.result[0].track.image600 = 'result.0.track.image600';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'result.0.track.artist',
            title: 'result.0.track.song',
            image: 'result.0.track.image600',
            endTime: null,
        });
    });

    it('should return track without image', async() => {
        await expect(resolver.get()).resolves.toEqual({
            artist: 'result.0.track.artist',
            title: 'result.0.track.song',
            image: null,
            endTime: null,
        });
    });

    it('should not return image if it\'s default cover', async() => {
        result.result[0].track.image600 = 'url/DefaultTrack/url.jpg';

        await expect(resolver.get()).resolves.toEqual({
            artist: 'result.0.track.artist',
            title: 'result.0.track.song',
            image: null,
            endTime: null,
        });
    });

    it('should return undefined if playlist is empty', async() => {
        result.result.length = 0;
        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if resolverArguments not passed', async() => {
        stream.resolverArguments = null;
        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if stream not found', async() => {
        stream.resolverArguments = '{"id":7}';
        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if resolverArguments is broken', async() => {
        stream.resolverArguments = '[}';
        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
