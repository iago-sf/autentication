let express = require("express");
let router = express.Router();
let tokenController = require("../controllers/Token.controller");

router.get("/confirmation/:token", tokenController.confirmationGet);

module.exports = router;