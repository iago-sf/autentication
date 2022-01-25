const express = require("express");
const authControllerAPI = require("../controllers/Auth.controller");
const router = express.Router();

router.post("/authenticate", authControllerAPI.authenticate);

module.exports = router;
