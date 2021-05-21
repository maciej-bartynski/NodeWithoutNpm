const crypto = require("crypto");
const config = require("../config");

const helpers = {}

helpers.createHash = (str) => {
    if (!str || typeof str !== "string") return null;
    return crypto.createHmac("sha256", config.secret).update(str).digest("hex");
}

helpers.parseJson = str => {
    try {
        return JSON.parse(str)
    } catch {
        return {}
    }
}

helpers.isAuth = (providedPass, user) => {
    const hash = helpers.createHash(providedPass);
    return hash === user.password
}

module.exports = helpers;