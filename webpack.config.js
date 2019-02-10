const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        jreact: path.join(__dirname, 'src', 'jreact.ts')
    },
    output: {
        filename: '[name]_bundle.js',
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
    devtool: 'source-map',
    watch: true
};