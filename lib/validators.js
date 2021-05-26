const validators = {};

validators.validateName = (possiblyName) => {
  const isValid =
    typeof possiblyName === "string" &&
    possiblyName.length >= 3 &&
    possiblyName.length <= 30;
  return isValid ? "" : "Min length is 3 char., max length is 30 char.";
};

validators.validatePassword = (possiblyPassword) => {
  const isString = typeof possiblyPassword === "string";

  const msgs = {
    isShortEnough: "Password to short. Length range: 8-30.",
    isLongEnough: "Password to long. Length range: 8-30.",
    isValidContent:
      "Password must contain at least one uppercase, one lowercase, one number and one special character.",
  };

  if (isString) {
    const isLongEnough = possiblyPassword.length >= 8;
    const isShortEnough = possiblyPassword.length <= 30;
    const isValidContent = possiblyPassword.match(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/
    );

    let message = "";
    switch (true) {
      case !isLongEnough: {
        message = msgs.isLongEnough;
        break;
      }
      case !isShortEnough: {
        message = msgs.isShortEnough;
        break;
      }
      case !isValidContent: {
        message = msgs.isValidContent;
        break;
      }
      default: {
        message === "";
      }
    }
    return message;
  } else {
    return "Invalid password.";
  }
};

validators.validatePhone = (possiblyPhonenumber) => {
  const isString = typeof ("" + possiblyPhonenumber) === "string";
  const isValidContent = isString && possiblyPhonenumber.match(/^[0-9]{9}$/g);
  return isValidContent ? "" : "Valid phonenumber consits of 9 digits";
};

validators.validateEmail = (possiblyPhonenumber) => {
  const isString = typeof possiblyPhonenumber === "string";
  const isValidContent =
    isString && possiblyPhonenumber.match(/^[^\s@]+@[^\s@]+$/g);
  return isValidContent
    ? ""
    : "Valid email address has format anything@anything.anything.";
};

module.exports = validators;
