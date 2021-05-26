const sampleHandler = require("./sample");
const pingHandler = require("./ping");
const usersHandler = require("./users");
const loginHandler = require("./login");

const ROUTES = {
  sample: "/sample",
  ping: "/ping",
  users: "/users",
  login: "/login"
};

const HANDLERS = {
  sample: sampleHandler,
  ping: pingHandler,
  users: usersHandler,
  login: loginHandler
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
