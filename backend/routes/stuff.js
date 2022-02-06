const express = require("express");
const router = express.Router();
const controller = require("../controllers/stuff");

router.post("/", controller.createThing);
router.put("/:id", controller.modifyThing);
router.delete("/:id", controller.deleteThing);
router.get("/:id", controller.readOneThing);
router.get("/", controller.readThing);

module.exports = router;