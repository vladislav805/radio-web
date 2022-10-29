import * as React from 'react';

import { defaultRadioContext, RadioContext, radioContextReducer } from '@components/PlayerContext/PlayerContext';
import { Header } from '@components/Header';
import { Content } from '@components/Content';
import { Footer } from '@components/Footer';
import { Player } from '@components/Player';

import { appCn } from './App.const';

import './App.scss';

export const App: React.FC = () => {
    const [context, dispatch] = React.useReducer(radioContextReducer, defaultRadioContext);

    const playerContext = React.useMemo(() => ({
        current: context.current,
        audio: context.audio,
        state: context.state,
        dispatch,
    }), [context, dispatch]);

    const station = context.current?.station;
    const stream = context.current?.stream;

    return (
        <RadioContext.Provider value={playerContext}>
            <div className={appCn}>
                <Header />
                <Content activeStation={station} activeStream={stream} />
                <Footer station={station} stream={stream} />
                {context.current !== undefined && (
                    <Player stream={context.current.stream} />
                )}
            </div>
        </RadioContext.Provider>
    )
};
