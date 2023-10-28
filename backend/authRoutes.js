const express = require("express");
const passport = require("./passport-config"); // Importez la configuration de Passport
const User = require("./models/User"); // Importez le modèle User
const router = express.Router();
const bcrypt = require("bcrypt");

router.post(
  "/login",
  passport.authenticate("local", {
    //successRedirect: "/dashboard",
    //failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    // Cette fonction ne sera appelée que si l'authentification réussit
    res.json({ message: "Connexion réussie" }); // Envoyer un message de succès au format JSON
  }
);

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifiez d'abord si un utilisateur avec le même nom d'utilisateur existe déjà
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Le nom d'utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    //res.redirect("/login");
    res.json({ message: "Inscription réussie" }); // Envoyer un message de succès au format JSON
  } catch (error) {
    console.error(error);
    //res.redirect("/register");
    res.status(500).json({ message: "Erreur lors de l'inscription" }); // Envoyer un message d'erreur au format JSON
  }
});

module.exports = router;
