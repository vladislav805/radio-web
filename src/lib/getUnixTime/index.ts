export function getUnixTime(): number {
    return (Date.now() / 1000) | 0;
}
