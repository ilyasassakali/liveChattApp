const express = require("express");
const passport = require("./passport-config"); // Importez la configuration de Passport
const User = require("./models/User"); // Importez le modèle User
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("lololo: ", user);
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
      console.log("User logged in:", user);

      return res.json({ success: "true", user });
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

router.get("/get-session", (req, res) => {
  res.json(req.session);
});

router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
