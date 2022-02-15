const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const controller = require("../controllers/stuff");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//routes
router.post("/", auth, multer, controller.createThing);
router.post("/:id/like",auth, controller.likeDislikeThing);
router.put("/:id", auth, multer, controller.modifyThing);
router.delete("/:id", auth, controller.deleteThing);
router.get("/:id", auth, controller.readOneThing);
router.get("/", auth, controller.readThing);

module.exports = router;