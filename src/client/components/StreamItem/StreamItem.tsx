import * as React from 'react';

import type { IStream } from '@typings';
import { Button } from '@components/Button';

import { cnStreamItem, streamItemMetaCn, streamItemTitleCn } from './StreamItem.const';

import './StreamItem.scss';

interface IStreamItemProps {
    stream: IStream;
    active: boolean;
    onClick: (stream: IStream) => void;
}

export const StreamItem: React.FC<IStreamItemProps> = ({ stream, active, onClick }) => {
    const onClickLocal = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onClick(stream);
    }, [stream]);
    return (
        <Button
            type="button"
            theme="pure"
            className={cnStreamItem({ active })}
            onClick={onClickLocal}
        >
            <div className={streamItemTitleCn}>{stream.cityTitle}</div>
            <div className={streamItemMetaCn}>{stream.format}, {stream.bitrate} kbps</div>
        </Button>
    );
};
