const del = require("./delete");
const get = require("./get");
const put = require("./put");
const post = require("./post")

const ALLOWED_METHODS = ["get", "post", "delete", "put"];
const userOperations = {
  post,
  put,
  delete: del,
  get,
};

module.exports = (data, callback) => {
  const { method } = data;
  const isAllowed = ALLOWED_METHODS.find(
    (item) => item === method.toLowerCase()
  );
  if (isAllowed) {
    userOperations[method.toLowerCase()](data, callback);
  } else {
    callback(404);
  }
};
