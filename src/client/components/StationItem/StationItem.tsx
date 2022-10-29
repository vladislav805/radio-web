import * as React from 'react';

import type { IStation } from '@typings';
import { Button } from '@components/Button';

import { cnStationItem } from './StationItem.const';

import './StationItem.scss';

interface IStationListItemProps {
    station: IStation;
    onClick: (station: IStation) => void;
    active: boolean;
    playing: boolean;
}

export const StationItem: React.FC<IStationListItemProps> = ({ station, active, playing, onClick }) => {
    const onClickLocal = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onClick(station);
    }, [station, onClick]);

    return (
        <Button
            type="button"
            theme="pure"
            view="block"
            onClick={onClickLocal}
            className={cnStationItem({ active, playing })}
        >
            {station.title}
        </Button>
    );
};
