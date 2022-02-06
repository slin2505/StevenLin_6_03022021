const thing = require("../models/thing");

exports.createThing = (req,res, next) =>{
    delete req.body._id;
    const productThing = new thing({
        ...req.body
    });

    thing.save()
        .then(() => res.status(201).json({message : "Sauce crée."}))
        .catch(err => res.status(400).json({err}));
};

exports.modifyThing = (req, res, next) =>{
    thing.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message : "Sauce modifiée."}))
        .catch(err => res.status(400).json({err}));
};

exports.deleteThing = (req, res, next) =>{
    thing.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message : "Sauce supprimée."}))
    .catch(err => res.status(400).json({err}));
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