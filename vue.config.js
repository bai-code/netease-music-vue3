const path = require('path')

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less', // 如果使用scss修改即可
      patterns: [
        // 全局变量路径 多个
        path.resolve(__dirname, './src/utils/globalStyle.less'),
        path.resolve(__dirname, './src/utils/globalColor.less')
      ]
    }
  }
}
