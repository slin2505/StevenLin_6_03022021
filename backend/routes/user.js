// dependances 
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Controller + middleware
const userCtrl = require("../controllers/user");
const passwordCtrl = require("../middleware/passwordValidator");

//routes signUp et login
router.post("/signup",[
    body("email")
    .trim()
    .isEmail().withMessage("Doit être un email valide")
    .normalizeEmail(),
    body("password")
    .trim()
    .isLength({min : 8, max : 30}),
], passwordCtrl, userCtrl.signup); 

router.post("/login",[
    body("email")
        .trim()
        .isEmail().withMessage("Doit être un email valide")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({min : 8, max : 30}),
], passwordCtrl, userCtrl.login);

module.exports = router;