import * as fs from 'fs';
import type { IStation } from '../../types';

export function renderPageLegacy(stations: IStation[]): string {
    return fs.readFileSync('template.html', { encoding: 'utf-8' }).replace('{{STATIONS}}', JSON.stringify(stations));
}
