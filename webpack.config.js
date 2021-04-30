const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    mode: 'production',
    // mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    stats: 'minimal',
    performance: {
        hints: false,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    externals: [nodeExternals()], // exclude external modules
};
