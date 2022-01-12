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

module.exports = app;