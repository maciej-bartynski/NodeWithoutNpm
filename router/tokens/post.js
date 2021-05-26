const dataOperations = require("./../../lib/data");
const {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
} = require("./../../lib/validators");
const { createHash } = require("./../../lib/helpers");

const post = (data, callback) => {
  const { payload } = data;
  const { phone, name, email, password } = payload;
  const phoneInvalidMessage = validatePhone(phone);
  const nameInvalidMessage = validateName(name);
  const emailInvalidMessage = validateEmail(email);
  const passwordInvalidMessage = validatePassword(password);

  if (
    phoneInvalidMessage ||
    nameInvalidMessage ||
    emailInvalidMessage ||
    passwordInvalidMessage
  ) {
    callback(400, {
      error: `Missing required fields.${phoneInvalidMessage} ${emailInvalidMessage} ${nameInvalidMessage} ${passwordInvalidMessage}`,
    });
  } else {
    dataOperations.read("users", phone, (existsErr, existsData) => {
      if (existsErr && !existsData) {
        const passHash = createHash(password);
        dataOperations.create(
          "users",
          phone,
          { phone, name, email, password: passHash },
          (creationErr, creationData) => {
            if (creationErr) {
              callback(400, {
                error: "User not created.",
                message: creationErr,
              });
            } else {
              callback(200, { success: "User created.", data: creationData });
            }
          }
        );
      } else {
        callback(400, { error: "User with that phonenumber already exists." });
      }
    });
  }
};

module.exports = post;
