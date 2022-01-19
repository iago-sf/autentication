const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Token = require("./Token");
const crypto = require("crypto");
const mailer = require("../mailer/mailer");

const validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  return re.test(email);
};

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    required: [true, "El nombre es obligatorio"],
  },

  email: {
    type: String,
    trim: true,
    required: [true, "El email es obligatorio"],
    lowercase: true,
    unique: true,
    validate: [validateEmail, "Por favor, introduzca un email válido"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/],
  },

  password: {
    type: String,
    required: [true, "El password es obligatorio"],
  },

  passwordResetToken: String,
  passwordResetTokenExpires: Date,

  verificado: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.plugin(uniqueValidator, {
  message: "El email ya existe para otro usuario.",
});

// Define una acción previa a una o varias acciones de manipulación de datos
// En este caso encripta la contraseña
usuarioSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    let saltRounds = 10;
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  next();
});

usuarioSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Crear un email de bienvenida con el token
usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
  let token = new Token({
    _userId: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  }); //El token es un String en hexadecimal

  let email_destination = this.email;

  token.save(function (err) {
    if (err) return console.log(err.message);

    let mailOptions = {
      from: "no-reply@iago.com",
      to: email_destination,
      subject: "Verificación de cuenta",
      text:
        "Hola,\n\n" +
        "Por favor, para verificar su cuenta haga click en este enlace: \n" +
        "http://localhost" +
        "/token/confirmation/" +
        token.token +
        ".\n",
    };

    mailer.sendMail(mailOptions, function (err) {
      if (err) return console.log(err.message);

      console.log(
        "Se ha enviado un email de bienvenida a " + email_destination + "."
      );
    });
  });
};

usuarioSchema.methods.resetPassword = function (cb) {
  let token = new Token({
    _userId: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  let email_destination = this.email;

  token.save(function (err) {
    if (err) return cb(err);

    let mailOptions = {
      from: "no-reply@redbicicletas.com",
      to: email_destination,
      subject: "Reseteo de password de cuenta",
      text:
        "Hola,\n\n" +
        "Por favor, para resetear el password de su cuenta haga click en este enlace: \n" +
        "localhost" +
        "/resetPassword/" +
        token.token +
        ".\n",
    };

    mailer.sendMail(mailOptions, function (err) {
      if (err) return cb(err);

      console.log("Se ha enviado un email para resetear el password a: " + email_destination + ".");
    });

    cb(null);
  });
};

module.exports = mongoose.model("Usuario", usuarioSchema);
