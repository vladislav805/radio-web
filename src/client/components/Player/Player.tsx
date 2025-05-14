import * as React from 'react';
import type Hls from 'hls.js';

import type { IStream } from '@typings';
import { KEY_VOLUME, RadioContext, RadioState } from '@components/PlayerContext/PlayerContext';
import { setValue } from '@lib/localStorage';

interface IPlayerProps {
    stream: IStream;
}

const BLANK = 'about:blank';

function getStreamUrl(stream: IStream): string {
    let url = stream.url;

    if (stream.secure && url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
    }

    return url;
}

async function createAudio(stream: IStream): Promise<{ audio: HTMLAudioElement; hls: Hls | undefined }> {
    let url = getStreamUrl(stream);

    const audio = new Audio();
    let hls: Hls | undefined;

    if (stream.format === 'm3u8') {
        // lazy-module не получился
        const { default: HlsModule } = await import(/* webpackChunkName: 'hls' */ 'hls.js');
        if (HlsModule.isSupported()) {

            hls = new HlsModule();
            hls.loadSource(url);
            hls.attachMedia(audio);

            hls.on(HlsModule.Events.MANIFEST_PARSED, () => audio.play());
        } else {
            alert('HLS are not supported by your browser');
        }
    } else {
        if (!url.includes('?')) {
            url += `?_=${Math.random()}`;
        }
        audio.src = url;
    }

    return { audio, hls };
}

export const Player: React.FC<IPlayerProps> = ({ stream }) => {
    const { dispatch, state: playerState } = React.useContext(RadioContext);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const hlsRef = React.useRef<Hls>(null);

    React.useEffect(() => {
        // Замыкания для функции коллбека-onunmount
        let audioLocal: HTMLAudioElement;

        const onPlay = () => dispatch({ action: 'state', state: RadioState.PLAYING });
        const onPause = () => dispatch({ action: 'state', state: RadioState.PAUSED });
        const onLoading = () => dispatch({ action: 'state', state: RadioState.WAITING });

        createAudio(stream).then(({ audio, hls }) => {
            audioRef.current = audio;

            audioLocal = audio;

            if (hls !== undefined) {
                hlsRef.current = hls;
            }

            audio.addEventListener('waiting', onLoading);
            audio.addEventListener('playing', onPlay);
            audio.addEventListener('pause', onPause);

            dispatch({ action: 'init', audio });

            audio.play();
        });

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            audioLocal.removeEventListener('waiting', onLoading);
            audioLocal.removeEventListener('playing', onPlay);
            audioLocal.removeEventListener('pause', onPause);

            dispatch({ action: 'init', audio: undefined });
            audioLocal.src = BLANK;
        };
    }, [stream, dispatch]);

    React.useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const { state, volume } = playerState;

        audio.volume = volume;

        setValue(KEY_VOLUME, volume);

        switch (state) {
            case RadioState.PLAYING: audio.play(); break;
            case RadioState.PAUSED: audio.pause(); break;
        }
    }, [audioRef.current, playerState]);

    return null;
};
