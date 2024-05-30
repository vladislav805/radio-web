import { resolve } from 'path';

import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { Paths } from '../paths.mjs';

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

/** @type {import('webpack').Configuration} */
export const config = {
    mode,
    target: 'web',

    entry: {
        client: resolve(Paths.src, 'client', 'index.tsx'),
    },

    output: {
        path: Paths.dist,
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: 'swc-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@components': resolve(Paths.src, 'client', 'components'),
            '@lib': resolve(Paths.src, 'client', 'lib'),
            '@typings': resolve(Paths.src, 'client', 'typings'),
        },
    },

    optimization: {
        minimize: isProduction,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.EnvironmentPlugin({
            VERSION: process.env.npm_package_version,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(Paths.root, 'html', 'index.html'),
            minify: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].css',
        }),
    ],

    devtool: isProduction ? undefined : 'source-map',

    devServer: {
        static: resolve(Paths.root, 'html'),
        port: 8077,
    },

    stats: 'minimal',
};
