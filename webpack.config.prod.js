const path = require('path');
module.exports = {
    mode: 'production',
    entry: {
        index: path.join(__dirname, 'src', 'index.tsx')
    },
    output: {
        filename: '[name]_prod.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /.tsx?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                loader: 'awesome-typescript-loader'
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.css']
    },
    devtool: 'source-map'
};