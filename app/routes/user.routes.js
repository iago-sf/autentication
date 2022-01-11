const express = require('express');
const UserController = require('../controllers/User.controller');

const router = express.Router();

router.get('/login/:error?', UserController.login)
      .post('/login', UserController.find)
      .get('/register/:error?', UserController.register)
      .get('/logout', UserController.logout)

module.exports = router;