let express = require("express");
let router = express.Router();
let indice = require("../controllers/Indice.controller");

router.get("/", indice.index);

module.exports = router;