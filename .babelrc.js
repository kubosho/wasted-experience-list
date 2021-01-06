const presets = ['@babel/preset-env', '@babel/preset-typescript'];
const plugins = [
    [
        '@babel/plugin-transform-react-jsx',
        {
            runtime: 'automatic',
            importSource: 'preact',
        },
    ],
];

module.exports = { presets, plugins };
