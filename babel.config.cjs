// babel.config.js
/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  const isTest = api.env("test"); // Jest sets NODE_ENV to 'test'
  /** @type {import('@babel/core').PluginItem[]} */
  const presets = [
    [
      "next/babel",
      isTest
        ? {
            "preset-env": {
              modules: "commonjs",
            },
          }
        : {},
    ],
  ];
  /** @type {import('@babel/core').PluginItem[]} */
  const plugins = [];
  return {
    presets,
    plugins,
  };
};
