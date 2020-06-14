import { IApiParams } from '../types';

const endpoint = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:7469/';

const apiRequest = <T>(method: string, params: IApiParams): Promise<T> => fetch(`${endpoint}api/${method}?${new URLSearchParams(params).toString()}`).then(res => res.json()).then(res => res.result);

export default apiRequest;
