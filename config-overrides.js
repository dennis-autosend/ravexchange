const path = require('path');

module.exports = function override(config, env) {
  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  };

  config.module.rules.find(rule => rule.oneOf).oneOf.forEach(r => {
    if (r.test && r.test.toString().includes('css')) {
      r.use.splice(-1, 0, postCssLoader);
    }
  });

  return config;
};