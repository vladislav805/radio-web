import { Icon_type_arrowLeft } from './_type/Icon_type_arrowLeft';
import { Icon_type_pause } from './_type/Icon_type_pause';
import { Icon_type_play } from './_type/Icon_type_play';
import { Icon_type_playlist } from './_type/Icon_type_playlist';
import { Icon_type_questionCircle } from './_type/Icon_type_questionCircle';
import { Icon_type_time } from './_type/Icon_type_time';

export const iconRegistry = {
    Icon_type_arrowLeft,
    Icon_type_pause,
    Icon_type_play,
    Icon_type_playlist,
    Icon_type_questionCircle,
    Icon_type_time,
} as const;

export type IconType = keyof typeof iconRegistry;
