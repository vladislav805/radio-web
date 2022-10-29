import type { IStation } from '@typings';
import { apiRequest } from './apiRequest';

export function getStationsList(): Promise<IStation[]> {
    return apiRequest<IStation[]>('getStations', { extended: '1', noReferrer: '1' });
}
