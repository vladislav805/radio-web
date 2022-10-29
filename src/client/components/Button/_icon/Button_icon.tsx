import * as React from 'react';

import { Icon } from '@components/Icon';
import type { IconType } from '@components/Icon/Icon.registry';

import type { IButtonProps } from '../Button.typings';

import './Button_icon.scss';

interface IButtonWithIconProps {
    iconType: IconType;
    iconSize?: number;
    iconColor?: string;
    iconClassName?: string;
}

export function withIcon<T extends IButtonProps>(Base: React.ComponentType<T>): React.ComponentType<T & IButtonWithIconProps> {
    return props => {
        return (
            <Base
                {...props}
                className={`Button_withIcon ${props.className}`}
            >
                <Icon
                    type={props.iconType}
                    size={props.iconSize}
                    color={props.iconColor}
                    className={props.iconClassName}
                />
            </Base>
        );
    };
}
