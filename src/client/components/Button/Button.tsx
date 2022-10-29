import * as React from 'react';

import { cnButton } from './Button.const';
import type { IButtonProps } from './Button.typings';

import './Button.scss';
import './Button_type_normal.scss';
import './Button_type_pure.scss';
import './Button_view_default.scss';
import './Button_view_block.scss';

export const Button: React.FC<IButtonProps> = props => {
    return (
        <button
            type={props.type}
            className={cnButton({ theme: props.theme, view: props.view ?? 'default' }, [props.className])}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};
