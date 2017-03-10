var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/client');
var APP_DIR = path.resolve(__dirname, 'src/client');

var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'huddle.react.js'
    },
    module: {
        loaders : [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel'
            }
        ]
    },
    externals: {
        "postal": "postal",
        "moment": "moment",
        "react": "React",
        "react-dom": "ReactDOM",
        "react-router": "ReactRouter"
    }

};

module.exports = config;
