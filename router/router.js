const sampleHandler = require("./sample");
const pingHandler = require("./ping");
//const tokensHandler = require("./tokens");
const usersHandler = require("./users");

const ROUTES = {
  sample: "/sample",
  ping: "/ping",
  users: "/users",
  //tokens: "/tokens",
};

const HANDLERS = {
  sample: sampleHandler,
  ping: pingHandler,
  users: usersHandler,
  //tokens: tokensHandler,
};

const router = {
  notFound: (data, callback) => {
    callback(404);
  },
};

Object.entries(ROUTES).forEach(([key, pathName]) => {
  router[pathName] = HANDLERS[key];
});

module.exports = router;
