import type { TResolverFetch } from '@server/Resolver';
import type { IStreamDatabase } from '@typings';

import { DfmResolver, IDfmRaw } from './dfm';

describe('resolvers/dfm', () => {
    let stream: IStreamDatabase;

    let result: IDfmRaw;

    let resolver: DfmResolver;
    let fetch: jest.Mock<Promise<IDfmRaw>>;

    beforeEach(() => {
        stream = {
            canResolveTrack: true,
            trackUrl: 'url',
            resolverArguments: '{"id":"stream_1"}',
        } as IStreamDatabase;

        resolver = new DfmResolver(stream);

        result = {
            stream_1: {
                current_track: {
                    id: 'id',
                    name: 'name',
                    picture: {
                        id: 'picture.id',
                        url_absolute: 'picture.url_absolute',
                        url_relative: 'picture.url_relative',
                    },
                    song_artist: 'song_artist',
                    song_title: 'song_title',
                },
                playlist: [],
            }
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
            image: 'picture.url_absolute',
            endTime: null,
        });
    });

    it('should return track without image', async() => {
        result.stream_1.current_track.picture = null;

        await expect(resolver.get()).resolves.toEqual({
            artist: 'song_artist',
            title: 'song_title',
            image: null,
            endTime: null,
        });
    });

    it('should return undefined if requested stream not found', async() => {
        stream.resolverArguments = '{"id":"my_stream"}';

        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if arguments not passed', async() => {
        stream.resolverArguments = null;

        await expect(resolver.get()).resolves.toBeUndefined();

        stream.resolverArguments = '';

        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if arguments not valid', async() => {
        stream.resolverArguments = '{]';

        await expect(resolver.get()).resolves.toBeUndefined();
    });

    it('should return undefined if request failed', async() => {
        fetch.mockRejectedValue(undefined);

        await expect(resolver.get()).resolves.toBeUndefined();
    });
});
