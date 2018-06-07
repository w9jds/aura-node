const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: 'aura',
    context: __dirname,
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    target: 'node',
    devtool: 'sourcemap',
    entry: {
        aura: ['./index.ts']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts', '.js']
    }
};
