const tokenisation = require("../../lib/tokenisation");
const dataOperations = require("./../../lib/data");
const helpers = require("./../../lib/helpers");
const validators = require("./../../lib/validators");

const login = (data, callback) => {
  const { payload } = data;
  const { phone, password } = payload;
  const phoneInvalidMessage = validators.validatePhone(phone);
  const passwordInvalidMessage = validators.validatePassword(password);

  if (phoneInvalidMessage && passwordInvalidMessage) {
    callback(400, {
      error: `Should receive password and phone. ${phoneInvalidMessage} ${passwordInvalidMessage}`,
    });
  } else {
    dataOperations.read("users", phone, (existsErr, user) => {
      if (user && !existsErr) {
        const thisUserCanLoginThisPassword = helpers.isPasswordOk(password, user);
        if (thisUserCanLoginThisPassword) {
          delete user.password;
          tokenisation.serializeUser(user, (err, token) => { 
              if (token && !err) callback(200, { token })
              else {
                callback(403, {
                  error: "Something went wrong",
                  message: err,
                })
              }
          })
        } else {
          callback(403, {
            error: "This user cannot login with this password",
          });
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

module.exports = login;
