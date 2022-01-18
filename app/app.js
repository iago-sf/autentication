const express = require('express');
const app = express();
const path = require('path')

app.use(express.urlencoded());

const usuariosRouter = require("./routes/user.routes");
const tokenRouter = require("./routes/token.routes");

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use("/token", tokenRouter);
app.use("/usuarios", usuariosRouter);

app.get("/login", function(req,res) {
  res.render("session/login");
});
app.post("/login", function (req,res,next) {

});
app.get("/logout", function (req,res) {
  res.redirect("/");
});
app.get("/forgotPassword", function (req,res) {

});
app.post("/forgotPassword", function (req,res) {

});

module.exports = app;