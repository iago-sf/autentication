var Usuario = require("../models/User");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

module.exports = {
  authenticate: function (req, res, next) {
    console.log(req.body)
    Usuario.findOne({ email: req.body.email }, function (err, userInfo) {
      if (err) {
        next(err);

      } else {
        if (userInfo === null) {
          return res
            .status(401)
            .json({status: "error", message: "Correo o password incorrecto!", data: null, });
        }

        if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
          let token = jwt.sign({ id: userInfo._id }, req.app.get("secretkey"), { expiresIn: "7d",});

          res
            .status(200)
            .json({message: "Usuario encontrado!", data: { usuario: userInfo, token: token }, });

        } else {
          res
            .status(401)
            .json({status: "error", message: "Correo o clave incorrecta", data: null, });
        }
      }
    });
  },
};
