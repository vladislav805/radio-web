export interface ICurrentTrack {
    /** Исполнитель */
    artist: string;

    /** Название трека */
    title: string;

    /** Cover-image */
    image: string | null;

    /** Конец завершения текущего трека в unixtime */
    endTime: number | null;
}
