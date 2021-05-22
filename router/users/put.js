const dataOperations = require("./../../lib/data");
const { createHash } = require("./../../lib/helpers");
const helpers = require("./../../lib/helpers");

const put = (data, callback) => {
  const { payload } = data;
  const { phone, name, email, password } = payload;
  const phoneInvalidMessage = helpers.validatePhone(phone);
  const nameInvalidMessage = helpers.validateName(name);
  const emailInvalidMessage = helpers.validateEmail(email);
  const passwordInvalidMessage = helpers.validatePassword(password);

  if (
    phoneInvalidMessage &&
    nameInvalidMessage &&
    emailInvalidMessage &&
    passwordInvalidMessage
  ) {
    callback(400, {
      error: `Should receive password, phone and at least one more field. ${phoneInvalidMessage} ${emailInvalidMessage} ${passwordInvalidMessage} ${nameInvalidMessage}`,
    });
  } else {
    dataOperations.read("users", phone, (existsErr, user) => {
      if (user && !existsErr) {
        const passHash = createHash(password);
        const userAuthenticated = helpers.isAuth(password, user);
        if (userAuthenticated) {
          const newUser = {
            name: nameInvalidMessage ? user.name : name,
            email: emailInvalidMessage ? user.email : email,
          };

          dataOperations.update(
            "users",
            phone,
            { ...user, ...newUser, password: passHash },
            (err) => {
              if (err) callback(400, { error: err });
              else callback(200, { success: true });
            }
          );
        } else {
          callback(403);
        }
      } else {
        callback(400, {
          error: "User with that phonenumber not exists.",
          message: existsErr,
        });
      }
    });
  }
};

module.exports = put;
