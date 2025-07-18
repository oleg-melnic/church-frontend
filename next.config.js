const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

module.exports = withNextIntl({
  // i18n: {
  //   locales: ['ru', 'ro'],
  //   defaultLocale: 'ru',
  //   localeDetection: true,
  // },
  webpack(config) {
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto',
      use: ['json-loader'],
    });
    return config;
  },
});