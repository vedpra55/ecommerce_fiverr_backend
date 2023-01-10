const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

function hashPassword(password) {
  return bcrypt.hashSync(password, salt);
}

function comparePassword(inputPassword, hashedPassword) {
  return bcrypt.compareSync(inputPassword, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
