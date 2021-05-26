const crypto = require("crypto");
const config = require("../config");

const helpers = {};

helpers.createHash = (str) => {
  if (!str || typeof str !== "string") return null;
  return crypto.createHmac("sha256", config.secret).update(str).digest("hex");
};

helpers.createToken = () => {
  const random = Date.now();
  const input = Math.floor(Math.random() * 100);
  return crypto
    .createHmac("sha256", "x" + random)
    .update("y" + input)
    .digest("hex");
};

helpers.parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
};

helpers.isPasswordOk = (providedPass, user) => {
  const hash = helpers.createHash(providedPass);
  return hash === user.password;
};

module.exports = helpers;
