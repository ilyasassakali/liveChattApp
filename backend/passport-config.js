const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Importez le modèle User

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user;

      if (username === process.env.ADMIN_USERNAME) {
        // Als het de admin-gebruiker is, zoek deze op basis van de isAdmin-vlag
        user = await User.findOne({ isAdmin: true });
      } else {
        // Anders, zoek op gebruikersnaam zoals eerder
        user = await User.findOne({ username });
      }

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        // Als het de admin-gebruiker is, vergelijk zonder bcrypt
        return done(null, user);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
