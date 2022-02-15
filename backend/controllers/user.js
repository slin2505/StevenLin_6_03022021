const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.signup = (req, res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty){
        return res.status(400).json({errors : errors.array})
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            const newUser = new user({
                email: req.body.email,
                password : hash,
            });

            newUser.save()
                .then(() => res.status(201).json({message : "Compte crée !"}))
                .catch(err => res.status(400).json({err}));
        })
        .catch(err => res.status(500).json({err}));
};

exports.login = (req, res, next) =>{

    const errors = validationResult(req);

    if(!errors.isEmpty){
        return res.status(400).json({errors : errors.array})
    }
    
    user.findOne({email: req.body.email})
        .then(user =>{
            if(!user){
                return res.status(401).json({error: "Utilisateur inexistant !"})
            } else{
                bcrypt.compare(req.body.password, user.password)
                    .then(valid =>{
                        if(!valid){
                            return res.status(401).json({error: "Mot de passe incorrect !"});
                        } else{
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    "RANDOM_TOKEN_SECRET",
                                    {expiresIn: "24h"}
                                )
                            });
                        }                  
                    })
                    .catch(err => res.status(500).json({err}));
            }
        })
        .catch(err => res.status(500).json({err}));
};