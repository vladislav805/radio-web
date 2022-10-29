function getString(name: string): string | undefined;
function getString(name: string, defaultValue: string): string;
function getString(name: string, defaultValue?: string): string | undefined {
    const value = name in window.localStorage
        ? window.localStorage[name]
        : undefined;

    return value ?? defaultValue;
}

function getNumber(name: string): number | undefined;
function getNumber(name: string, defaultValue: number): number;
function getNumber(name: string, defaultValue?: number): number | undefined {
    const str = getString(name);

    if (str === undefined) return defaultValue;

    const num = Number(str);

    return Number.isNaN(num) ? defaultValue : num;
}

function setValue(name: string, value: number | string | undefined): void {
    window.localStorage[name] = value;
}

export {
    setValue,
    getNumber,
    getString,
};
