const thing = require("../models/thing");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

exports.createThing = (req,res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty){
        return res.status(400).json({errors : errors.array})
    }

    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    const productThing = new thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    productThing.save()
        .then(() => res.status(201).json({message : "Sauce crée."}))
        .catch(err => res.status(400).json({err}));
};

exports.modifyThing = (req, res, next) =>{
    const thingObject = req.file ? { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : {...req.body };

    thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})
        .then(() => res.status(200).json({message : "Sauce modifiée."}))
        .catch(err => res.status(400).json({err}));
};

exports.deleteThing = (req, res, next) =>{
    thing.findOne({ _id: req.params.id})
        .then(thing =>{
            if(!thing){
                return res.status(404).json({err: new Error("Objet non trouvé")});
            }
            
            if(thing.userId !== req.auth.userId){
                return res.status(401).json({err: new Error("Requête non autorisée !")});
            }

            const filename = thing.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () =>{
                thing.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message : "Sauce supprimée."}))
                .catch(err => res.status(400).json({err}));
            });
    });
};

exports.readThing = (req, res, next) =>{
    thing.find()
        .then(things => res.status(200).json(things))
        .catch(err => res.status(400).json(err));
};

exports.readOneThing = (req, res, next) =>{
    thing.findOne({_id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(err => res.status(404).json(err)); 
};

exports.likeDislikeThing = (req, res, next) =>{
    const userId = req.body.userId;
    const like = req.body.like;
    console.log(userId, like)
    thing.findOne({ _id: req.params.id})
        .then(thing =>{
            if(!thing.usersLiked.includes(userId) && like === 1){
                thing.updateOne({_id: req.params.id}, {$inc : {likes: 1}, $push : {userLiked: userId}})
                    .then(() => res.status(201).json({message : "Like +1 !"}))
                    .catch(err => res.status(400).json(err));
            };

            if(thing.usersLiked.includes(userId) && like === 0){
                thing.updateOne({_id: req.params.id}, {$inc : {likes: -1}, $pull : {userLiked: userId}})
                    .then(() => res.status(201).json({message : "Like enlevé !"}))
                    .catch(err => res.status(400).json(err));
            };

            if(!thing.usersDisliked.includes(userId) && like === -1){
                thing.updateOne({_id: req.params.id}, {$inc : {dislikes: 1}, $push : {userDisliked: userId}})
                    .then(() => res.status(201).json({message : "Dislike +1 !"}))
                    .catch(err => res.status(400).json(err));
            };

            if(thing.usersDisliked.includes(userId) && like === 0){
                thing.updateOne({_id: req.params.id}, {$inc : {dislikes: -1}, $pull : {userDisliked: userId}})
                    .then(() => res.status(201).json({message : "Dislike enlevé !"}))
                    .catch(err => res.status(400).json(err));
            };
        })
        .catch(err => res.status(404).json(err));

};