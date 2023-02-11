import type { IApiParams } from '@typings';

export function convertParams<T extends Record<string, any>>(params: IApiParams): T {
    const props = {} as T;
    let key: keyof T;

    for (key in params) {
        type P = T[typeof key];

        const value = params[key as string];

        const isTrue = value === 'true';
        const isFalse = !isTrue && value === 'false';

        const isNumber = value !== '' && Number.isNaN(Number(value)) === false;

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
