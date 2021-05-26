const validators = require("../../lib/validators");
const dataOperations = require("./../../lib/data");

const get = (data, callback) => {
  const { params } = data;
  const { phone } = params;
  const phoneInvalidMessage = validators.validatePhone(phone);

  if (phoneInvalidMessage) {
    callback(400, { error: phoneInvalidMessage });
  } else {
    dataOperations.read("users", phone, (existsErr, user) => {
      delete user.password;
      if (user && !existsErr) {
        callback(200, { success: true, data: user });
      } else {
        callback(400, { error: "User doesn't exist.", message: existsErr });
      }
    });
  }
};

module.exports = get;
