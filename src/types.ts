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
    cityTitle: string;
}

export interface ICurrentTrack {
    artist: string;
    title: string;
    image?: string;
}

export type IApiParams<T = Record<string, string>> = T;

export type IApiEndpointResult<T> = Promise<IResult<T> | IError>;

export type IApiEndpoint<R, P = never> = (params: IApiParams<Record<string, string | string[]> | P>) => IApiEndpointResult<R>;
