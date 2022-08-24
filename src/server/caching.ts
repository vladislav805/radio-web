import { getUnixTime } from './utils';

const __cache: Record<string, {
    expires: number;
    data: any,
}> = {};

export const cache = <T>(name: string, data: T, ttl = 3600) => {
    __cache[name] = {
        expires: getUnixTime() + ttl,
        data,
    };
};

export const cached = <T>(name: string): T | undefined => {
    const item = __cache[name];
    return !item || item && item.expires < getUnixTime()
        ? undefined
        : item.data;
};
