const path = require('path');

module.exports = {
  reactStrictMode: true,

  webpack(config, { webpack }) {

    config.resolve.alias['@'] = path.join(__dirname, 'src');


    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    config.externals.push({
      sharp: 'commonjs sharp',
      canvas: 'commonjs canvas',
    });

    return config;
  },
};
