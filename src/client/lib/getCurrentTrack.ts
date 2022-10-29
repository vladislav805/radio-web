import type { ICurrentTrack } from '@typings';

import { apiRequest } from './apiRequest';

export async function getCurrentTrack(streamId: number): Promise<ICurrentTrack | undefined> {
    const response = await apiRequest<ICurrentTrack>('getCurrentTrack', {
        streamId: String(streamId)
    });

    return Boolean(response) ? response : undefined;
}
