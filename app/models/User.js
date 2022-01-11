const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  return re.test(email);
}

const UserSchema = new mongoose.Schema({
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

UserSchema.plugin(uniqueValidator, {message: "El email ya existe para otro usuario."});

// Define una acción previa a una o varias acciones de manipulación de datos
// En este caso encripta la contraseña 
UserSchema.pre("save", function(next) {
  if (this.isModified("password")){
    let saltRounds = 10;
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
 
  next();
});


UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync (password, this.password);
}

module.exports = mongoose.model("users", UserSchema);