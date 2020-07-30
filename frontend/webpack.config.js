const path = require('path');

const config = {
    devtool: 'eval-source-map',
    entry: path.resolve('./src/index.jsx'),
    output: {
        path: path.resolve('./public'),
        filename: 'bundle.js',
        publicPath: path.resolve('./public')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = config;
