import type { IStream } from '@typings';

export interface IStreamDatabase extends IStream {
    // Used for backend and has in database
    trackUrl?: string;
    trackResolverId?: number;
}

export interface ITrackResolver {
    resolverId: number;
    type: 'json' | 'dynamic';
    source: string;
}

export type IApiParams<T extends Record<string, string> = Record<string, string>> = T;

export type IApiEndpointResult<T> = Promise<T>;

export type IApiEndpoint<R> = (params: IApiParams) => IApiEndpointResult<R>;
