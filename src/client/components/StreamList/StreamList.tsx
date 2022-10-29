import * as React from 'react';

import type { IStation, IStream } from '@typings';
import { RadioContext } from '@components/PlayerContext/PlayerContext';
import { StreamItem } from '@components/StreamItem';
import { Button } from '@components/Button';
import { Icon } from '@components/Icon';

import { cnStreamList, streamListBackCn } from './StreamList.const';

import './StreamList.scss';

interface IStreamListProps {
    station: IStation | undefined;
    activeStream: IStream | undefined;
    onClose: () => void;
}

const IconBack = (
    <Icon type="Icon_type_arrowLeft" />
);

export const StreamList: React.FC<IStreamListProps> = props => {
    const show = props.station !== undefined;

    const { dispatch } = React.useContext(RadioContext);

    const onClick = React.useCallback((stream: IStream) => {
        if (props.station === undefined) return;

        dispatch({ action: 'set', station: props.station, stream })
    }, [props.station]);

    return (
        <div className={cnStreamList({ show })}>
            <Button
                onClick={props.onClose}
                theme="pure"
                type="button"
                view="block"
                className={streamListBackCn}
            >
                {IconBack}
                Return to stations list
            </Button>
            {props.station?.streams.map(stream => (
                <StreamItem
                    key={stream.streamId}
                    stream={stream}
                    active={props.activeStream === stream}
                    onClick={onClick}
                />
            ))}
        </div>
    );
};
