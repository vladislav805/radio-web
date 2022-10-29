import * as React from 'react';

import { rangeCn } from './Range.const';

import './Range.scss';

interface IRangeProps {
    value: number;
    setValue: (value: number) => void;
    min: number;
    max: number;
    step: number;
    className?: string;
}

export const Range: React.FC<IRangeProps> = React.memo(props => {
    const { value, setValue, min, max, step } = props;

    const onChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
        setValue(+event.target.value);
    }, [setValue]);

    const val = (value - min) * 100 / (max - min);

    return (
        <input
            className={`${rangeCn} ${props.className || ''}`}
            style={{ '--range-progress': `${val}%` } as React.CSSProperties}
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
        />
    );
});
