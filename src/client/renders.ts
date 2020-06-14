import classNames from 'classnames';
import { IStation, IStream } from '../types';
import { e } from './dom';
import { CLASS_STATION_ACTIVE, CLASS_STREAM_ACTIVE } from './classNames';

type IRenderRowProps = {
    title: string;
    info: string;
    onClick: <T extends Event>(event: T) => unknown;
};

export const renderRow = (props: IRenderRowProps) => e('div', {
    'class': 'listItem',
    onClick: props.onClick,
}, [
    e('div', {
        'class': 'listItem-title',
    }, props.title),
    e('div', {
        'class': 'listItem-right',
    }, props.info),
]);



type IRenderStationOptions = {
    onClick: () => unknown;
    currentStation: IStation;
};

export const renderStation = (station: IStation, { onClick, currentStation }: IRenderStationOptions) => {
    const node = renderRow({
        title: station.title,
        info: Array.from(new Set(station.streams.map(stream => stream.cityTitle))).join(', '),
        onClick,
    });
    node.dataset.stationId = String(station.stationId);

    if (station.stationId === currentStation?.stationId) {
        node.classList.add(CLASS_STATION_ACTIVE);
    }

    return node;
};



type IRenderStreamOptions = {
    onClick: () => unknown;
    currentStream: IStream;
};

export const renderStream = (stream: IStream, { onClick, currentStream }: IRenderStreamOptions) => {
    const node = renderRow({
        title: stream.cityTitle,
        info: `${stream.format}, ${stream.bitrate} kbps`,
        onClick,
    });
    node.dataset.streamId = String(stream.streamId);

    if (stream.streamId === currentStream?.streamId) {
        node.classList.add(CLASS_STREAM_ACTIVE);
    }

    return node;
};




