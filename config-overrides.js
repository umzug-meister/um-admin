module.exports = function override(config, env) {
  console.log(env);
  config.output.filename = 'main.js';
  return config;
};
