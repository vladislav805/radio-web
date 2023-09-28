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
    flag: string;

    // Used for external API
    canResolveTrack?: boolean;
}
