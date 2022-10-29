export interface ITrackResolver {
    resolverId: number;
    type: 'json' | 'dynamic';
    source: string;
}
