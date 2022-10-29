import type { IApiParams } from '@typings';

export const getUnixTime = (): number => (Date.now() / 1000) | 0;

// @ts-ignore
export const getValueByPath = <T>(obj: object, path: string): T => path?.split('.').reduce((acc, c) => acc?.[c], obj) ?? undefined;

export function convertParams<T extends Record<string, any>>(params: IApiParams): T {
    const props = {} as T;
    let key: keyof T;

    for (key in params) {
        type P = T[typeof key];

        const value = params[key as string];

        const isTrue = value === '1' || value === 'true';
        const isFalse = !isTrue && (value === '0' || value === 'false');

        const isNumber = Number.isNaN(Number(value)) === false;

        if (isNumber) {
            props[key] = Number(value) as P;
        } else if (isTrue || isFalse) {
            props[key] = isTrue as P;
        } else {
            props[key] = value as P;
        }
    }

    return props as T;
}
