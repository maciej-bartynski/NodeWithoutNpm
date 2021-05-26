const dataOperations = require("./../../lib/data");

const del = (data, callback) => {
  const { authorizedUser } = data;
  const { phone } = authorizedUser || {};

  if (!authorizedUser) {
    callback(403, { error: "Unauthorized." });
  } else {
    dataOperations.read("users", phone, (err, user) => {
      if (user && !err) {
        dataOperations.remove("users", phone, (err) => {
          if (err) callback(400, { error: err });
          else callback(200);
        });
      } else {
        callback(400, { error: err });
      }
    });
  }
};

module.exports = del;
