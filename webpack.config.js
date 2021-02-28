/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const { EnvironmentPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PUBLIC_DIR = 'public';
const OUT_DIR = 'bundle';

module.exports = {
    entry: {
        background: path.join(__dirname, 'lib', 'background.js'),
        popup: path.join(__dirname, 'lib', 'popup.js'),
    },
    output: {
        path: path.join(__dirname, OUT_DIR),
        filename: '[name].bundle.js',
    },
    target: 'web',
    module: {
        rules: [
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
                    from: path.join(__dirname, PUBLIC_DIR, 'popup.html'),
                    to: path.join(__dirname, OUT_DIR),
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    mode: process.env.NODE_ENV,
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
};
