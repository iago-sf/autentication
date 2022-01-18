const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; 
const Usuario = require("../models/Usuario");

passport.use(new LocalStrategy(

));

passport.serializeUser(function (user, cb) { 
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  Usuario.findById(id, function (err, usuario) {
    cb(err, usuario); 
  });
});

module.exports = passport;