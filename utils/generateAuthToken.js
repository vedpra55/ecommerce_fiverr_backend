const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "500d",
  });
};

module.exports = generateAuthToken;
