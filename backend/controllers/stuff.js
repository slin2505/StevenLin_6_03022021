// dependances 
const Thing = require("../models/Thing");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

// Controller création de sauce
exports.createThing = (req,res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty){
        return res.status(400).json({errors : errors.array})
    }

    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    const productThing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    productThing.save()
        .then(() => res.status(201).json({message : "Sauce crée."}))
        .catch(err => res.status(400).json({err}));
};

// Controller modification de sauce
exports.modifyThing = (req, res, next) =>{
    let thingObject = undefined;
    if(req.file){
        thingObject = { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }

        Thing.findOne({_id: req.params.id})
        .then(thing =>{
            const filename = thing.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () =>{});
        });
    } else{
        thingObject = {...req.body};
    }

    Thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})
        .then(() => res.status(200).json({message : "Sauce modifiée."}))
        .catch(err => res.status(400).json({err}));
};

// Controller Supression de sauce
exports.deleteThing = (req, res, next) =>{
    Thing.findOne({ _id: req.params.id})
        .then(thing =>{
            if(!thing){
                return res.status(404).json({err: new Error("Objet non trouvé")});
            }
            
            if(thing.userId !== req.auth.userId){
                return res.status(401).json({err: new Error("Requête non autorisée !")});
            }

            const filename = thing.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () =>{
                Thing.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message : "Sauce supprimée."}))
                .catch(err => res.status(400).json({err}));
            });
    });
};

// Controller Affichage des Sauces
exports.readThing = (req, res, next) =>{
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(err => res.status(400).json(err));
};

// Controller pour afficher une sauce unique
exports.readOneThing = (req, res, next) =>{
    Thing.findOne({_id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(err => res.status(404).json(err)); 
};

// Controller Like et Dislike
exports.likeDislikeThing = (req, res, next) =>{
    const userId = req.body.userId;
    const like = req.body.like;
    console.log(userId, like);
    
    Thing.findOne({ _id: req.params.id})
        .then(thing =>{
            if(!thing.usersLiked.includes(userId) && like === 1){
                Thing.updateOne({_id: req.params.id}, {$inc : {likes: 1}, $push : {usersLiked: userId}})
                    .then(() => res.status(201).json({message : "Like +1 !"}))
                    .catch(err => res.status(400).json(err));
            };

            if(thing.usersLiked.includes(userId) && like === 0){
                Thing.updateOne({_id: req.params.id}, {$inc : {likes: -1}, $pull : {usersLiked: userId}})
                    .then(() => res.status(201).json({message : "Like enlevé !"}))
                    .catch(err => res.status(400).json(err));
            };

            if(!thing.usersDisliked.includes(userId) && like === -1){
                Thing.updateOne({_id: req.params.id}, {$inc : {dislikes: 1}, $push : {usersDisliked: userId}})
                    .then(() => res.status(201).json({message : "Dislike +1 !"}))
                    .catch(err => res.status(400).json(err));
            };

            if(thing.usersDisliked.includes(userId) && like === 0){
                Thing.updateOne({_id: req.params.id}, {$inc : {dislikes: -1}, $pull : {usersDisliked: userId}})
                    .then(() => res.status(201).json({message : "Dislike enlevé !"}))
                    .catch(err => res.status(400).json(err));
            };
        })
        .catch(err => res.status(404).json(err));

};