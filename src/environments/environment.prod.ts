declare var require :any
export const environment = {
  appVersion: require('../../package.json').version,
  production: true,
  baseUrl :  "https://devza.com/tests/tasks/"
};
