module.exports = {
    devServer: {
        proxy: {
            '^/users': {
                target: 'http://localhost:9000/',
                ws: true,
                changeOrigin: true
            },
        }
    }
}