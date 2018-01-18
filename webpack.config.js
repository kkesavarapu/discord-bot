var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './app/index.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'        
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'app')
                ],
                query: {
                    presets: ['env']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
}