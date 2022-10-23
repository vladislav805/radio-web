import getStations from '../methods/getStations';
import { renderPageLegacy } from './page';

export async function pageLegacy(): Promise<string> {
    const stations = await getStations({ extended: true });

    return renderPageLegacy(stations);
}
