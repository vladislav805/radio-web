import * as React from 'react';

import type { ICurrentTrack, IStation, IStream } from '@typings';
import { Button } from '@components/Button';
import { getCurrentTrack } from '@lib/getCurrentTrack';
import { Icon } from '@components/Icon';
import { withIcon } from '@components/Button/_icon';

import { cnCurrentTrack, currentTrackButtonCn, currentTrackCoverCn, currentTrackInfoCn, currentTrackImageCn } from './CurrentTrack.const';

import './CurrentTrack.scss';

interface ICurrentTrackProps {
    station: IStation | undefined;
    stream: IStream | undefined;
}

const ButtonWithIcon = withIcon(Button);

const notSupported = 'Getting a track is\nnot supported on this station';

export const CurrentTrack: React.FC<ICurrentTrackProps> = ({ station, stream }) => {
    const isNowPlaying = stream !== undefined;
    const supported = stream !== undefined && Boolean(stream.canResolveTrack);

    const [info, setInfo] = React.useState<ICurrentTrack | undefined>(undefined);
    const [busy, setBusy] = React.useState<boolean>(false);

    const onClick = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
        if (stream === undefined) return;

        setBusy(true);

        void getCurrentTrack(stream.streamId).then(info => {
            setInfo(info);
            setBusy(false);
        });
    }, [stream]);

    React.useEffect(() => {
        setInfo(undefined);
    }, [stream]);

    let title: string = 'No station selected';
    let subtitle: string | undefined;

    if (station !== undefined && stream !== undefined) {
        if (info !== undefined) {
            title = `${info.artist} — ${info.title}`;
            subtitle = `${station.title}, ${stream.cityTitle}`;
        } else {
            title = station.title;
            subtitle = `${stream.cityTitle}`;
        }
    }

    return (
        <div className={cnCurrentTrack({ busy, supported })}>
            <div className={currentTrackCoverCn}>
                {info?.image !== undefined ? (
                    <img
                        className={currentTrackImageCn}
                        src={info.image}
                        alt=""
                    />
                ) : (
                    <Icon type="Icon_type_playlist" />
                )}
            </div>
            <div className={currentTrackInfoCn}>
                <h3>{title}</h3>
                {subtitle && <h4>{subtitle}</h4>}
            </div>
            {isNowPlaying && (supported ? (
                <ButtonWithIcon
                    type="button"
                    theme="normal"
                    onClick={onClick}
                    disabled={busy}
                    className={currentTrackButtonCn}
                    iconType={busy ? "Icon_type_time" : "Icon_type_questionCircle"}
                />
            ) : (
                <div className={currentTrackButtonCn}>
                    {notSupported}
                </div>
            ))}
        </div>
    )
};
