const express = require("express");
const passport = require("./passport-config"); // Importez la configuration de Passport
const User = require("./models/User"); // Importez le modèle User
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ success: "true" });
    });
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifiez d'abord si un utilisateur avec le même nom d'utilisateur existe déjà
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with that username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "Register succes" }); // Envoyer un message de succès au format JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Register error" }); // Envoyer un message d'erreur au format JSON
  }
});

module.exports = router;
