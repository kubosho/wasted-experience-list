const presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                node: 'current',
            },
        },
    ],
    '@babel/preset-typescript',
];
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
