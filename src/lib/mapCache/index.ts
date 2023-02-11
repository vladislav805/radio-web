import { getUnixTime } from '../getUnixTime';

interface ICacheEntry {
    expires: number;
    data: any,
}

const __cache: Record<string, ICacheEntry> = {};

export function pushCache<T>(name: string, data: T, ttl = 3600): void {
    __cache[name] = {
        expires: getUnixTime() + ttl,
        data,
    };
};

export function getCachedValue<T>(name: string): T | undefined {
    const item = __cache[name];

    if (item === undefined) return undefined;

    if (item.expires < getUnixTime()) {
        // @ts-ignore delete медленный
        __cache[name] = undefined;
        return undefined;
    }

    return item.data;
}

/**
 * Только для тестов
 * @private
 */
export function purgeCache() {
    for (const key of Object.keys(__cache)) {
        delete __cache[key];
    }
}
