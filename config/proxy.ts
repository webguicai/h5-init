/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  dev: {
    '/api': {
      target: 'http://20.20.129.142:9998',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    '/api': {
      target: 'http://20.20.129.142:9998',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api': {
      target: 'http://20.20.129.142:9998',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
