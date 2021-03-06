export const getUnixTime = (): number => (Date.now() / 1000) | 0;

export const getValueByPath = (obj: object, path: string) => path?.split('.').reduce((acc, c) => acc?.[c], obj) ?? undefined;
