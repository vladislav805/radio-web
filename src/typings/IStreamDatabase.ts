import type { IStream } from './IStream';

export interface IStreamDatabase extends IStream {
    /** URL для получения текущего трека */
    trackUrl?: string;

    /** Техническое название для резолвера */
    resolver: string | null;

    /** Аргументы для резолвера */
    resolverArguments: string | null;
}
