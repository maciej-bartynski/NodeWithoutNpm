const dataOperations = require("./data");
const path = require("path");
const { createHash } = require("./helpers");
const helpers = require("./helpers");

const userOperations = {
  post: (data, callback) => {
    const { payload } = data;
    const { phone, name, email, password } = payload;
    const phoneValid = typeof phone === "string" && phone.length === 9;
    const nameValid = typeof name === "string" && name.length >= 3;
    const emailValid = typeof email === "string" && email.length >= 3;
    const passwordValid = typeof password === "string" && password.length >= 5;

    if (phoneValid && nameValid && emailValid && passwordValid) {
      dataOperations.read("users", phone, (existsErr, existsData) => {
        if (existsErr) {
          const passHash = createHash(password);
          dataOperations.create(
            "users",
            phone,
            { phone, name, email, password: passHash },
            (creationErr, creationData) => {
              if (creationErr) {
                callback(400, {
                  error: "user not created",
                  message: creationErr,
                });
              } else {
                callback(200, { success: "user created", data: creationData });
              }
            }
          );
        } else {
          callback(400, { error: "user with that phonenumber already exists" });
        }
      });
    } else {
      callback(400, {
        error: `missing required fields. Received phone: ${phoneValid}, received email: ${emailValid}, received name: ${nameValid}`,
      });
    }
  },
  get: (data, callback) => {
    const { params } = data;
    const { phone } = params;
    const phoneValid = typeof phone === "string" && phone.length === 9;

    if (phoneValid) {
      dataOperations.read("users", phone, (existsErr, user) => {
        const safeUser = delete user.password;
        if (user && !existsErr) {
          callback(200, { success: true, data: safeUser });
        } else {
          callback(400, { error: "user doesn't exist", message: existsErr });
        }
      });
    } else {
      callback(400, { error: "missing required param: phone" });
    }
  },
  put: (data, callback) => {
    const { payload } = data;
    const { phone, name, email, password } = payload;
    const phoneValid = typeof phone === "string" && phone.length === 9;
    const nameValid = typeof name === "string" && name.length >= 3;
    const emailValid = typeof email === "string" && email.length >= 3;
    const passwordValid = typeof password === "string" && password.length >= 5;

    if (phoneValid || nameValid || emailValid || passwordValid) {
      dataOperations.read("users", phone, (existsErr, user) => {
        if (user && !existsErr) {
          const passHash = createHash(password);
          const userAuthenticated = helpers.isAuth(password, user);
          if (userAuthenticated) {
            const newUser = {
              name: nameValid ? name : user.name,
              email: emailValid ? email : user.email,
            };

            dataOperations.update(
              "users",
              phone,
              { ...user, ...newUser, password: passHash },
              (err) => {
                if (err) callback(400, { error: "error updating user" });
                else callback(200, { success: true });
              }
            );
          } else {
            callback(503);
          }
        } else {
          callback(400, {
            error: "user with that phonenumber not exists",
            message: existsErr,
          });
        }
      });
    } else {
      callback(400, {
        error: `missing required fields. Received phone: ${phoneValid}, received email: ${emailValid}, received name: ${nameValid}`,
      });
    }
  },

  delete: (data, callback) => {
    const { payload } = data;
    const { phone, password } = payload;
    const phoneValid = typeof phone === "string" && phone.length === 9;
    const passwordValid = typeof password === "string" && password.length >= 5;
    if (phoneValid && passwordValid) {
      dataOperations.read("users", phone, (err, user) => {
        
        if (user && !err) {
          const isAuth = helpers.isAuth(password, user);
          if (isAuth) {
            dataOperations.remove("users", phone, (err) => {
              if (err) callback(400);
              else callback(200);
            });
          } else {
            callback(403);
          }
        } else {
          callback(400);
        }
      });
    } else {
      callback(400);
    }
  },
};

const handlers = {
  ["/sample"]: (data, callback) => {
    callback(406, { name: "sample handler" });
  },
  ["/ping"]: (data, callback) => {
    callback(200);
  },
  ["/users"]: (data, callback) => {
    const ALLOWED_METHODS = ["get", "post", "delete", "put"];
    const { method } = data;
    const isAllowed = ALLOWED_METHODS.find(
      (item) => item === method.toLowerCase()
    );
    if (isAllowed) {
      userOperations[method.toLowerCase()](data, callback);
    } else {
      callback(404);
    }
  },
  notFound: (data, callback) => {
    callback(404);
  },
};

module.exports = handlers;
