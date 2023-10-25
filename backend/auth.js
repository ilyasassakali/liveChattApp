const passport = require("passport");
const initializePassport = require("./passport-config");
const { getUserByEmail, getUserById } = require("./database"); // Importeer de functies uit database.js
const User = require("./models/User");

initializePassport(
  passport,
  getUserByEmail, // Gebruik de geïmporteerde functies
  getUserById
);

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ success: true, message: "Gebruiker succesvol geregistreerd" });
  } catch (e) {
    res.json({
      success: false,
      message: "Er is een fout opgetreden bij de registratie",
    });
  }
};

const loginUser = passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
});

module.exports = {
  registerUser,
  loginUser,
};
