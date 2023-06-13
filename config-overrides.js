const webpack = require('webpack');
module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        "process/browser": require.resolve('process/browser'),
        stream: require.resolve("stream-browserify")
       
    };
    // config.action_cable.allowed_request_origins = [/http:\/\/*/, /https:\/\/*/];
    // config.action_cable.url = "wss://cable.coingecko.com/cable";
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ["buffer", "Buffer"],
        }),
    );

    return config;
}
