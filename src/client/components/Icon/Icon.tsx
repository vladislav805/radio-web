import * as React from 'react';

import { cnIcon } from './Icon.const';
import { iconRegistry, type IconType } from './Icon.registry';

import './Icon.scss';

interface IIconProps {
    type: IconType;
    className?: string;
    color?: string;
    size?: number;
}

export const Icon: React.FC<IIconProps> = React.memo(({
    type,
    className,
    color = 'currentColor',
    size = 2,
}) => {
    const width = `${size}rem`;
    return (
        <svg
            viewBox="0 0 24 24"
            role="presentation"
            width={width}
            height={width}
            className={cnIcon(null, [type, className])}
        >
            <path
                d={iconRegistry[type]}
                fill={color}
            />
        </svg>
    );
});
