import { CurrentTrack } from '@components/CurrentTrack';
import type { ICurrentTrack, IStation, IStream } from '@typings';
import * as React from 'react';

import { footerCn } from './Footer.const';

import './Footer.scss';

interface IFooterProps {
    station: IStation | undefined;
    stream: IStream | undefined;
}

export const Footer: React.FC<IFooterProps> = props => (
    <div className={footerCn}>
        <CurrentTrack station={props.station} stream={props.stream} />
    </div>
);
