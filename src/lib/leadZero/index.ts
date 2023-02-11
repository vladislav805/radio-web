export function leadZero(value: number, length = 2): string {
    return `${'0'.repeat(length)}${value}`.substr(-length);
}
