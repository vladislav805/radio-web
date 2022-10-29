import * as React from 'react';

import { StationItem } from '@components/StationItem';
import type { IStation } from '@typings';

import { stationListCn } from './StationList.const';

import './StationList.scss';

interface IStationListProps {
    items: IStation[];
    activeStation: IStation | undefined;
    playingStation: IStation | undefined;
    onClick: (station: IStation) => void;
}

export const StationList: React.FC<IStationListProps> = props => (
    <div className={stationListCn}>
        {props.items.map(station => (
            <StationItem
                key={station.stationId}
                station={station}
                active={props.activeStation === station}
                playing={props.playingStation === station}
                onClick={props.onClick}
            />
        ))}
    </div>
);
