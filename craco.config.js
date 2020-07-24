module.exports = {
  webpack: {
    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    }
  },
  devServer: {
    proxy: {
      '/api': 'http://164.68.101.162:8082',
      '/api/socket': {
        target: 'ws://164.68.101.162:8082',
        secure: true
      }
    }
  }
};
