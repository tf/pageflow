module.exports = {
  stories: ['../src/**/*.stories.js'],

  webpackFinal: async (config, {configType}) => {
    const rules = config.module.rules.map(rule => {
      if (rule.test.toString() !== '/\\.css$/') {
        return rule;
      }

      const use = rule.use.map(u => {
        const { loader } = u;

        if (!loader || !loader.includes('/css-loader/')) {
          return u;
        }

        const options = {
          ...u.options,
          modules: {
            localIdentName: '[name]_[local]__[hash:base64:5]'
          }
        };

        return {
          ...u,
          options
        };
      })

      return {
        ...rule,
        use
      };
    })

    return {
      ...config,
      module: {
        ...config.module,
        rules,
      }
    };

    //
    //config.module.rules.unshift({
    //  test: /\.module.css$/,
    //  use: ['style-loader',
    //        {loader: 'css-loader', options: { modules: true, importLoaders: 1 }},
    //       ]
    //});
    //
    //return config;
  }
};
