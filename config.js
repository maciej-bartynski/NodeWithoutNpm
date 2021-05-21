const environmentNames = {
  PRODUCTION: "production",
  STAGING: "staging",
};

const environments = {
  [environmentNames.PRODUCTION]: {
    PORT_HTTP: 5000,
    PORT_HTTPS: 5001,
    envName: environmentNames.PRODUCTION,
    secret: "asdfsadfasdfasdfasdfa94238rjhf0ksdf2893cso843u28jfd02983jd29083jd9283jd9283jd"
  },
  [environmentNames.STAGING]: {
    PORT_HTTP: 3000,
    PORT_HTTPS: 3001,
    envName: environmentNames.STAGING,
    secret: "asdfsadfasdfasdfasdfa94238rjhf"
  },
};

const determinedEnv = environments[process.env.NODE_ENV]
    ? environments[process.env.NODE_ENV]
    : environments[environmentNames.STAGING];

exports = environmentNames;
module.exports = determinedEnv;
