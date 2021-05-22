const dataOperations = require("./../../lib/data");
const helpers = require("./../../lib/helpers");

const del = (data, callback) => {
  const { payload } = data;
  const { phone, password } = payload;
  const phoneInvalidMessage = helpers.validatePhone(phone);
  const passwordInvalidMessage = helpers.validatePassword(password);

  if (phoneInvalidMessage || passwordInvalidMessage) {
    callback(400, { error: phoneInvalidMessage || passwordInvalidMessage });
  } else {
    dataOperations.read("users", phone, (err, user) => {
      if (user && !err) {
        const isAuth = helpers.isAuth(password, user);
        if (isAuth) {
          dataOperations.remove("users", phone, (err) => {
            if (err) callback(400, { error: err });
            else callback(200);
          });
        } else {
          callback(403, { error: "Unauthorized."});
        }
      } else {
        callback(400, { error: err });
      }
    });
  }
};

module.exports = del;
