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
      '/api': 'http://95.111.255.8:8085',
      '/api/socket': {
        target: 'ws://95.111.255.8:8085',
        secure: true
      }
    }
  }
};
