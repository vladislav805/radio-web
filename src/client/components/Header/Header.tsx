import * as React from 'react';

import type { IStation, IStream } from '@typings';
import { RadioContext, RadioState } from '@components/PlayerContext/PlayerContext';
import { Range } from '@components/Range';
import { Button } from '@components/Button';
import { withIcon } from '@components/Button/_icon';
import type { IconType } from '@components/Icon/Icon.registry';
import { HeaderTime } from './-Time';

import { headerCn, headerToggleCn, headerVolumeCn, headerControlsCn } from './Header.const';

import './Header.scss';

const ButtonWithIcon = withIcon(Button);

interface IHeaderProps {
    station?: IStation;
    stream?: IStream;
}

const iconMap: Record<RadioState, IconType> = {
    [RadioState.IDLE]: 'Icon_type_play',
    [RadioState.WAITING]: 'Icon_type_time',
    [RadioState.PLAYING]: 'Icon_type_pause',
    [RadioState.PAUSED]: 'Icon_type_play',
};

export const Header: React.FC<IHeaderProps> = () => {
    const { audio, dispatch, state } = React.useContext(RadioContext);

    const onVolumeChange = React.useCallback((value: number) => dispatch({ action: 'volume', value }), [audio]);

    const onToggleState = React.useCallback(() => {
        dispatch({ action: 'state', state: state.state === RadioState.PLAYING ? RadioState.PAUSED : RadioState.PLAYING });
    }, [state.state]);

    return (
        <div className={headerCn}>
            <div className={headerControlsCn}>
                <ButtonWithIcon
                    className={headerToggleCn}
                    type="button"
                    theme="normal"
                    view="default"
                    onClick={onToggleState}
                    disabled={state.state === RadioState.IDLE || state.state === RadioState.WAITING}
                    iconType={iconMap[state.state]}
                />
                <Range
                    className={headerVolumeCn}
                    min={0}
                    max={1}
                    step={0.01}
                    value={state.volume}
                    setValue={onVolumeChange}
                />
            </div>
            <HeaderTime />
        </div>
    );
};
