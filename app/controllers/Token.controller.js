let Usuario = require("../models/User");
let Token = require("../models/Token");

module.exports = {
  confirmationGet: function (req, res, next) {
    Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token)
        return res
          .status(400)
          .send({ type: "not-verified", msg: "No se ha verificado el email" });

      Usuario.findById(token._userId, function (err, usuario) {
        if (!usuario)
          return res
            .status(400)
            .send({ msg: "No encontramos un usuario con ese token" });

        if (usuario.verificado) return res.redirect("/usuarios");

        Usuario.findByIdAndUpdate(token._userId, {verificado: true}, function (err) {
          if (err) return res.status(500).send({ msg: err.message });

          res.redirect("/usuarios");
        });
      });
    });
  },
};