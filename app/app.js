const express = require('express');
const app = express();

app.use(express.urlencoded());

const User = require('./routes/user.routes');

app.use('/', User);

module.exports = app