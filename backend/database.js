const User = require("./models/User");

function getUserByEmail(email) {
  return User.findOne({ email: email });
}

function getUserById(id) {
  return User.findById(id);
}

module.exports = {
  getUserByEmail,
  getUserById,
};
