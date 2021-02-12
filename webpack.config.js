/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const { EnvironmentPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PUBLIC_DIR = 'public';
const OUT_DIR = 'bundle';

module.exports = {
    entry: {
        background: path.join(__dirname, 'lib', 'background.js'),
        main: path.join(__dirname, 'lib', 'main.js'),
    },
    output: {
        path: path.join(__dirname, OUT_DIR),
        filename: '[name].bundle.js',
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.js$/,
                use: { loader: 'babel-loader' },
            },
        ],
    },
    plugins: [
        new EnvironmentPlugin({ BUNDLE_ANALYZE: false, NODE_ENV: 'production' }),
        ...(process.env.BUNDLE_ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'manifest.json'),
                    to: path.join(__dirname, OUT_DIR),
                },
                {
                    from: path.join(__dirname, PUBLIC_DIR, 'index.html'),
                    to: path.join(__dirname, OUT_DIR),
                },
            ],
        }),
        new MiniCssExtractPlugin(),
    ],
    resolve: {
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    mode: process.env.NODE_ENV,
};
