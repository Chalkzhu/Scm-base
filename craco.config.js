const path = require('path');
const CracoLessPlugin = require('craco-less');

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

const devServerConfig = (devServerConfig) => {
  // 防止刷新路由丢失
  devServerConfig.historyApiFallback = true;
  devServerConfig.port = 9001;
  devServerConfig.proxy = {
    '/api': {
      target: 'xxx',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    }
  };
  return devServerConfig;
};

module.exports = {
  webpack: {
    alias: {
      '@': resolve('src'),
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#017eff' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  // devServer: devServerConfig,
  devServer: {
    port: 9003,
    hot: true,
    historyApiFallback: true,
    compress: true,
    proxy: {
      '/api': {
        target: 'xxx',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
};