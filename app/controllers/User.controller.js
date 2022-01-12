let Usuario = require("../models/User");

module.exports = {
  list: function (req, res, next) {
    Usuario.find({}, function (err, usuarios) {
      if (err) res.send(500, err.message);
      res.render("usuarios/index", { usuarios: usuarios });
    });
  },
  update_get: function (req, res, next) {
    Usuario.findById(req.params.id, function (err, usuario) {
      res.render("usuarios/update", { errors: {}, usuario: usuario });
    });
  },
  update: function (req, res, next) {
    let update_values = { nombre: req.body.nombre };
    Usuario.findByIdAndUpdate(
      req.params.id,
      update_values,
      function (err, usuario) {
        if (err) {
          console.log(err);
          res.render("usuario/update", {
            errors: err.errors,
            usuario: new Usuario({
              nombre: req.body.nombre,
              email: req.body.email,
            }),
          });
        } else {
          res.redirect("/usuarios");
          return;
        }
      }
    );
  },
  create_get: function (req, res, next) {
    res.render("usuarios/create", { errors: {}, usuario: new Usuario() });
  },
  create: function (req, res, next) {
    if (req.body.password != req.body.confirm_password) {
      res.render("usuarios/create", {
        errors: {
          confirm_password: {
            message: "No coincide con el password introducido.",
          },
        },
        usuario: new Usuario({
          nombre: req.body.nombre,
          email: req.body.email,
        }),
      });
      return;
    }
    Usuario.create(
      {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
      },
      function (err, nuevoUsario) {
        if (err) {
          res.render("usuarios/create", {
            errors: err.errors,
            usuario: new Usuario({
              nombre: req.body.nombre,
              email: req.body.email,
            }),
          });
        } else {
          nuevoUsario.enviar_email_bienvenida();
          res.redirect("/usuarios");
        }
      }
    );
  },
  deleted: function (req, res, next) {
    Usuario.findByIdAndDelete(req.body.id, function (err) {
      if (err) next(err);
      else res.redirect("/usuarios");
    });
  },
};
