const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    context: path.join(__dirname),
    entry: {
        src: './demo.js',
    },
    output: {
        path: path.resolve(__dirname),
        filename: 'demo.bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
    ],
    devServer: {
        compress: true,
        historyApiFallback: true,
        host: 'localhost',
        hot: true,
        port: 3000,
    },
};
