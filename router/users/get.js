const helpers = require("../../lib/helpers");
const dataOperations = require("./../../lib/data");

const get = (data, callback) => {
  const { params } = data;
  const { phone } = params;
  const phoneInvalidMessage = helpers.validatePhone(phone);

  if (phoneInvalidMessage) {
    callback(400, { error: phoneInvalidMessage });
  } else {
    dataOperations.read("users", phone, (existsErr, user) => {
      const safeUser = delete user.password;
      if (user && !existsErr) {
        callback(200, { success: true, data: safeUser });
      } else {
        callback(400, { error: "User doesn't exist.", message: existsErr });
      }
    });
  }
};

module.exports = get;
