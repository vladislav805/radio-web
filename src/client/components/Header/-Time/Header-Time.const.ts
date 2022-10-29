import { cn } from '@bem-react/classname';

export const cnHeaderTime = cn('Header-Time');
export const headerTimeCn = cnHeaderTime();
export const headerTimeRowPlayedCn = cnHeaderTime('Row', { type: 'played' });
export const headerTimeRowBufferedCn = cnHeaderTime('Row', { type: 'buffered' });
export const headerTimeLabelCn = cnHeaderTime('Label');
export const headerTimeValueCn = cnHeaderTime('Value');
