const mongoose = require("mongoose");

// template sauce
const thingSchema = mongoose.Schema({
    userId : {type : String, required : true},
    name : {type : String, required : true},
    manufacturer : {type : String, required : true},
    description : {type : String, required : true},
    mainPepper : {type : String, required : true},
    imageUrl : {type : String, required : true},
    heat : {type : Number, required : true},
    likes : {type : Number, default : 0, required : false},
    dislikes : {type : Number, default : 0, required : false},
    usersLiked : {type : Array, required : false},
    usersDisliked : {type : Array, required : false},
});

module.exports = mongoose.model("thing", thingSchema);