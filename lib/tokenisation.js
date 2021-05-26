const helpers = require("./helpers");
const data = require("./data");

const tokenisation = {};

tokenisation.serializeUser = (user, callback) => {
  const token = helpers.createToken();

  data.create("tokens", token, { phone: user.phone }, (err) => {
    if (!err) {
      callback(false, token);
    } else {
      callback(err);
    }
  });
};

tokenisation.deserializeUser = (token, callback) => {
  data.read("tokens", token, (err, userPhone) => {
    if (!err && userPhone?.phone) {
      data.read("users", userPhone?.phone, (error, user) => {
        if (!error && user) {
          callback(false, user);
        } else {
          callback(error || "Something went wrong.");
        }
      });
    } else {
      callback(err || "Something went wrong.");
    }
  });
};

module.exports = tokenisation;
