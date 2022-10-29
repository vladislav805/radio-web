import type { IStream } from './IStream';

export interface IStreamDatabase extends IStream {
    trackUrl?: string;
    trackResolverId?: number;
}
