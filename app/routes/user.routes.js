let express = require("express");
let router = express.Router();
let usuarioController = require("../controllers/User.controller");

router.get("/", usuarioController.list)
      .get("/create", usuarioController.create_get)
      .post("/create", usuarioController.create)
      .post("/:id/delete", usuarioController.deleted)
      .get("/:id/update", usuarioController.update_get)
      .post("/:id/update", usuarioController.update);

module.exports = router;
