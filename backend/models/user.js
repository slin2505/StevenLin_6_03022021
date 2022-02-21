// dependances 
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const expressValidator = require("express-validator");

// template utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required:true},
});

// UniqueValidator pour l'email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);