import nesting from 'postcss-nesting';
import mediaMinMax from 'postcss-media-minmax';
import calc from 'postcss-calc';

/**
 * @type {import('postcss-load-config').Config}
 */
export default {
    plugins: [
        nesting({ noIsPseudoSelector: true }),
        mediaMinMax(),
        calc(),
    ],
};
