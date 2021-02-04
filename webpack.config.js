/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const ASSETS_DIR = 'assets';
const PUBLIC_DIR = 'public';
const OUT_DIR = 'bundle';

module.exports = {
    entry: {
        background: path.join(__dirname, 'lib', 'extension_specific', 'background.js'),
        contenteScripts: path.join(__dirname, 'lib', 'extension_specific', 'ContentScripts.js'),
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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'manifest.json'),
                    to: path.join(__dirname, OUT_DIR),
                },
                {
                    from: path.join(__dirname, PUBLIC_DIR, ASSETS_DIR, 'icon.svg'),
                    to: path.join(__dirname, OUT_DIR, ASSETS_DIR),
                },
                {
                    from: path.join(__dirname, PUBLIC_DIR, 'index.html'),
                    to: path.join(__dirname, OUT_DIR),
                },
            ],
        }),
    ],
    mode: 'production',
};
