export interface IResult<T> {
    result: T;
}

export interface IError {
    errorCode: number;
}

export interface IStation {
    stationId: number;
    title: string;
    streams?: IStream[];
}

export interface IStream {
    streamId: number;
    stationId: number;
    cityId: number;
    url: string;
    format: 'mp3' | 'm3u8' | 'aac' | 'ogg';
    bitrate: number;
    secure: boolean;
    noReferrer: boolean;
    cityTitle: string;

    // Used for external API
    canResolveTrack?: boolean;

    // Used for backend and has in database
    trackUrl?: string;
    trackResolverId?: number;
}

export interface ICurrentTrack {
    artist: string;
    title: string;
    image?: string;
}

export interface ITrackResolver {
    resolverId: number;
    type: 'json' | 'dynamic';
    source: string;
}

export type IApiParams<T = Record<string, string>> = T;

export type IApiEndpointResult<T> = Promise<T>;

export type IApiEndpoint<R, P = never> = (params: IApiParams<P | Record<string, string | string[]>>) => IApiEndpointResult<R>;
