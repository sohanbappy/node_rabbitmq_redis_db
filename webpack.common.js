const path = require('path');

module.exports = {
    entry: {
        'PacketV1': './src/PacketV1.js',
        'bappy': './src/bappy.js'
    },
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        ]
    }
};