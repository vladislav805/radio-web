const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

module.exports = {
    mode,
    target: 'node',
    entry: {
        server: path.resolve('src', 'server', 'index.ts'),
    },

    output: {
        path: path.resolve('dist', 'server'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.server.json',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.mjs' ],
        modules: ['node_modules', '.'],
        alias: {
            '@server': path.resolve('src', 'server'),
            '@typings': path.resolve('src', 'typings'),
        },
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.EnvironmentPlugin({
            VERSION: process.env.npm_package_version,
        }),
    ],

    devtool: false,
    stats: 'minimal',
};
