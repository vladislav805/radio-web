import * as React from 'react';

import type { IStation, IStream } from '@typings';
import { getStationsList } from '@lib/getStationsList';
import { StationList } from '@components/StationList';
import { StreamList } from '@components/StreamList';

import { contentCn } from './Content.const';

import './Content.scss';

interface IContentProps {
    activeStation?: IStation;
    activeStream?: IStream;
}

export const Content: React.FC<IContentProps> = React.memo(({ activeStation, activeStream }) => {
    const [items, setItems] = React.useState<IStation[] | undefined>();

    const [stationPreview, setStationPreview] = React.useState<IStation | undefined>();

    const closeStreamsPreview = React.useCallback(() => setStationPreview(undefined), [setStationPreview]);

    React.useEffect(() => {
        getStationsList().then(setItems);
    }, []);

    return (
        <div className={contentCn}>
            {items !== undefined && (
                <StationList
                    items={items}
                    activeStation={stationPreview}
                    playingStation={activeStation}
                    onClick={setStationPreview}
                />
            )}
            <StreamList
                station={stationPreview}
                activeStream={activeStream}
                onClose={closeStreamsPreview}
            />
        </div>
    );
});
