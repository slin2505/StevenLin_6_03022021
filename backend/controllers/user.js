// dependances 
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// Controller Signup 
exports.signup = (req, res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty){
        return res.status(400).json({errors : errors.array})
    }

    // Hash du password et création d'un nouveau utilisateur sur MongoDB
    bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            const newUser = new User({
                email: req.body.email,
                password : hash,
            });

            newUser.save()
                .then(() => res.status(201).json({message : "Compte crée !"}))
                .catch(err => res.status(400).json({err}));
        })
        .catch(err => res.status(500).json({err}));
};

// Controller Login
exports.login = (req, res, next) =>{

    const errors = validationResult(req);

    if(!errors.isEmpty){
        return res.status(400).json({errors : errors.array})
    }

    // on cherche l'email dans la base donnée et ensuite on compare les passwords
    User.findOne({email: req.body.email})
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
                                    process.env.passwordToken,
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