module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': true,
      },
    },
    cssnano: {},
  },
}
