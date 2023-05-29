module.exports = function override(config, env) {
  config.output.filename = 'main.[fullhash].js';
  return config;
};
