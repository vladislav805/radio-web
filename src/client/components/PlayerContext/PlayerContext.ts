import React from 'react';
import type { IStation, IStream } from '@typings';
import { getNumber } from '@lib/localStorage';

interface IRadioCurrent {
    station: IStation;
    stream: IStream;
}

interface IRadioState {
    state: RadioState;
    volume: number;
}

export enum RadioState {
    IDLE, // turn off
    WAITING, // loading
    PLAYING, // play
    PAUSED, // pause
}

interface IRadioContext {
    current?: IRadioCurrent;
    audio?: HTMLAudioElement;
    state: IRadioState;
    dispatch: (action: IRadioContextAction) => void;
}

type IRadioContextAction =
    | { action: 'init'; audio: HTMLAudioElement | undefined }
    | { action: 'set'; station: IStation; stream: IStream }
    | { action: 'volume'; value: number }
    | { action: 'state'; state: RadioState }
;

export const KEY_VOLUME = '_v';

export function radioContextReducer(prev: IRadioContext, action: IRadioContextAction): IRadioContext {
    switch (action.action) {
        case 'set': {
            return {
                ...prev,
                current: {
                    station: action.station,
                    stream: action.stream,
                },
            }
        }

        case 'init': {
            return {
                ...prev,
                audio: action.audio,
            };
        }

        case 'volume': {
            return {
                ...prev,
                state: {
                    ...prev.state,
                    volume: action.value,
                },
            };
        }

        case 'state': {
            if (prev.state.state === action.state) return prev;

            return {
                ...prev,
                state: {
                    ...prev.state,
                    state: action.state,
                },
            };
        }
    }

    return prev;
}

export const defaultRadioContext: IRadioContext = {
    dispatch: () => {},
    state: {
        state: RadioState.IDLE,
        volume: getNumber(KEY_VOLUME, 1),
    },
};

export const RadioContext = React.createContext({} as IRadioContext);
