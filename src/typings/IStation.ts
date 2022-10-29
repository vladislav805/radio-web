import type { IStream } from './IStream';

export interface IStation {
    stationId: number;
    title: string;
    streams: IStream[];
}
