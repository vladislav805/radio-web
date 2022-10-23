import type { IApiParams } from '../types';
import { SERVER_PORT } from '../shared';

const endpoint = process.env.NODE_ENV === 'production' ? '/' : `http://localhost:${SERVER_PORT}/`;

const apiRequest = <T>(method: string, params: IApiParams): Promise<T> => fetch(`${endpoint}api/${method}?${new URLSearchParams(params).toString()}`).then(res => res.json()).then(res => res.result);

export default apiRequest;
