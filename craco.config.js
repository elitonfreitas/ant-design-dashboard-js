const CracoLessPlugin = require("craco-less");
const { getThemeVariables } = require("antd/dist/theme");

const modifyVariables = getThemeVariables({
  dark: false,
});
modifyVariables["@primary-color"] = "#389e0d";

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: modifyVariables,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
