const express = require("express");
const app = express();
const path = require("path");
const Usuario = require("./models/User");
const Token = require("./models/Token");
const jwt = require("jsonwebtoken");

app.use(express.urlencoded());
app.set('secretkey','JWT_PWD_!\!Ñ22ç334ñ');

const passport = require("./config/passport");
const session = require("express-session");

const store = new session.MemoryStore();

app.use(
  session({
    cookie: { magAge: 240 * 60 * 60 * 1000 }, //Tiempo en milisegundos
    store: store,
    saveUninitialized: true,
    resave: "true",
    secret: "cualquier cosa no pasa nada 477447",
  })
);
app.use(passport.initialize());
app.use(passport.session());

const usuariosRouter = require("./routes/user.routes");
const tokenRouter = require("./routes/token.routes");
const indice = require("./routes/indice.routes");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/token", tokenRouter);
app.use("/usuarios", loggedIn, usuariosRouter);
app.use("/indice", validarUsuario, indice);

/*
 * LOGIN
 */
app.get("/login", function (req, res) {
  res.render("session/login");
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, usuario, info) {
    if (err) return next(err);
    if (!usuario) return res.render("session/login", { info });

    req.logIn(usuario, function (err) {
      if (err) return next(err);

      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

app.get("/forgotPassword", function (req, res) {
  res.render("session/forgotPassword");
});

app.post("/forgotPassword", function (req, res) {
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    if (!usuario) return res.render("session/forgotPassword", {info: { message: "No existe ese email en nuestra BBDD." },});

    usuario.resetPassword(function (err) {
      if (err) return next(err);

      console.log("session/forgotPasswordMessage");
    });

    res.render("session/forgotPasswordMessage");
  });
});

app.get("/resetPassword/:token", function (req, res, next) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) return res.status(400).send({type: "not-verified", msg: "No existe un usuario asociado al token. Verifique que su token no haya expirado.",});

    Usuario.findById(token._userId, function (err, usuario) {
      if (!usuario) return res.status(400).send({ msg: "No existe un usuario asociado al token." });

      res.render("session/resetPassword", { errors: {}, usuario: usuario });
    });
  });
});

app.post("/resetPassword", function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    res.render("session/resetPassword", {
      errors: {
        confirm_password: {
          message: "No coincide con el password introducido.",
        },
      },

      usuario: new Usuario({ email: req.body.email }),
    });

    return;
  }

  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    (usuario.password = req.body.password),
      Usuario.findByIdAndUpdate(usuario._userId, {password: req.body.password}, function (err) {
        if (err) {
          res.render("session/resetPassword", {
            errors: err.errors,
            usuario: new Usuario({ email: req.body.email }),
          });
        } else {
          res.redirect("/login");
        }
      });
  });
});

function loggedIn(req,res,next) {
  if (req.user) {
    next();
 
  } else {
    console.log("Usuario no logueado");
    res.redirect("/login");
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretkey'), function(err, decoded){
    if (err) {
      res.json({status:"error", message: err.message, data:null});
  
    } else {
      req.body.userId = decoded.id;
      console.log('jwt verify: ' + decoded);
    
      next();
    }
  });
}
 

module.exports = app;
