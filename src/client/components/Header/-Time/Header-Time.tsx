import * as React from 'react';

import { RadioContext } from '@components/PlayerContext/PlayerContext';
import { toTimeFormat } from '@lib/toTimeFormat';

import { headerTimeCn, headerTimeLabelCn, headerTimeRowBufferedCn, headerTimeRowPlayedCn, headerTimeValueCn } from './Header-Time.const';

import './Header-Time.scss';

export const HeaderTime: React.FC = () => {
    const { audio } = React.useContext(RadioContext);
    const refPlayed = React.useRef<HTMLDivElement>(null);
    const refBuffered = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (audio === undefined) return;

        const onTimeUpdate = () => {
            if (refPlayed.current) {
                refPlayed.current.innerText = toTimeFormat(audio.currentTime);
            }
        };

        const bufferChange = () => {
            if (refBuffered.current) {
                console.log(audio.buffered)

                const hasBuffer = audio.buffered.length > 0;

                let text: string;

                if (hasBuffer) {
                    const buffered = audio.buffered.end(0);
                    const forwardLength = buffered - audio.currentTime;
                    text = toTimeFormat(forwardLength);
                } else {
                    text = '—';
                }

                refBuffered.current.innerText = text;
            }
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        const timer = setInterval(bufferChange, 500);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            clearInterval(timer);
        };
    }, [audio]);

    return (
        <div className={headerTimeCn}>
            <div className={headerTimeRowPlayedCn}>
                <span className={headerTimeLabelCn}>Played</span>
                <span className={headerTimeValueCn} ref={refPlayed}>0:00</span>
            </div>
            <div className={headerTimeRowBufferedCn}>
                <span className={headerTimeLabelCn}>Buffered</span>
                <span className={headerTimeValueCn} ref={refBuffered}>0:00</span>
            </div>
        </div>
    );
};
