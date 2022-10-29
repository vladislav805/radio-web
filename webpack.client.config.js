const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

module.exports = {
    mode,
    target: 'web',

    entry: {
        client: path.resolve('src', 'client', 'index.tsx'),
    },

    output: {
        path: path.resolve('dist', 'client'),
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
                            configFile: 'tsconfig.client.json',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
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
            '@components': path.resolve(__dirname, 'src', 'client', 'components'),
            '@lib': path.resolve(__dirname, 'src', 'client', 'lib'),
            '@typings': path.resolve(__dirname, 'src', 'client', 'typings'),
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
            template: path.resolve('html', 'index.html'),
            minify: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].css',
        }),
    ],

    devtool: isProduction ? undefined : 'source-map',
    devServer: {
        static: path.resolve('html'),
        port: 8077,
    },

    stats: 'minimal',
};
