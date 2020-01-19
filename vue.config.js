process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
    pluginOptions: {
        electronBuilder: {
            chainWebpackRendererProcess: config => {
                if (process.env.NODE_ENV === 'development') {
                    config.plugins.delete('prefetch')
                }
            }
        }
    }
}
