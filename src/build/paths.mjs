import { resolve } from 'path';

const root = resolve('.');

export const Paths = {
    root,
    src: resolve(root, 'src'),
    dist: resolve(root, 'dist'),
};
