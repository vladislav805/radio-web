import type { IApiParams, ICurrentTrack } from '@typings';

import { resolversRegistry } from '../resolvers/.registry';

import { convertParams } from '../../lib/convertParams';
import { getStreamById } from './getStreamById';

interface IParams {
    streamId: number;
}

export async function getCurrentTrack(props: IApiParams): Promise<ICurrentTrack> {
    const { streamId } = convertParams<IParams>(props);

    const stream = await getStreamById({
        streamId: String(streamId),
        needResolver: '1',
    });

    if (!stream) {
        throw new Error('Stream not found');
    }

    if (!stream.trackUrl || !stream.resolver) {
        throw new Error('This stream do not support resolving current track');
    }

    const ResolverCtr = resolversRegistry.get(stream.resolver);

    if (!ResolverCtr) {
        throw new Error('This stream do not support resolving current track (2)');
    }

    const resolver = new ResolverCtr(stream);

    const track = await resolver.get();

    if (track === undefined) {
        throw new Error('Track unavailable');
    }

    return track;
}
