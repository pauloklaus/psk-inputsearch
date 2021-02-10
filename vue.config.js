module.exports = {
    lintOnSave: false,
    css: {
        extract: true
    },
    configureWebpack: {
        externals: {
            vueBootstrap: {
                commonjs: "vue-bootstrap.js",
                root: "vue-boostrap"
            }
        }
    }
}
