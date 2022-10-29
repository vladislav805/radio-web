import { leadZero } from './leadZero';

export function toTimeFormat(n: number): string {
    const seconds = Math.floor(n % 60);
    const minutes = Math.floor(n / 60 % 60);
    const hours = Math.floor(n / 60 / 60 % 60);

    return `${hours > 0 ? `${hours}:` : ''}${minutes}:${leadZero(seconds)}`;
}
