const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();

exports.signup = (req, res, next) => {

    const cryptoMail = crypto.SHA256(req.body.email, process.env.KEY).toString();
    const mailVerification = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const passwordVerification = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/g
    
    if(mailVerification.test(req.body.email) === false) {

        return res.status(400).json({message: "L'adresse mail n'a pas un format valide"})
    }
    if(passwordVerification.test(req.body.password) === false) {

        return res.status(400).json({message: "Le mot de passe doit être entre 8 et 20 caracteres, contenir au moins 1 minuscule 1 majuscule 1 chiffre et 1 caractere special"})
    }
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({

            email: cryptoMail,
            password: hash
        })
        user.save()
        .then(() => res.status(201).json({message: "l'utilisateur a bien été créé"}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}

exports.login = (req, res, next) => {

    const cryptoMail = crypto.SHA256(req.body.email, process.env.KEY ).toString();
    console.log(cryptoMail);
    User.findOne({email: cryptoMail})
    .then(user => {

        if(!user) {
            return res.status(404).json({message: "l'utilisateur n'existe pas"});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            console.log(valid);
            if(!valid){

                return res.status(401).json({message: "Le mot de passe est invalide"});
            }
            res.status(201).json({
                
                userId: user._id,
                token: jwt.sign({userId: user._id}, process.env.RANDOM_TOKEN_SECRET, {expiresIn: "24h"})
            })
        })
        .catch(error => res.status(500).json({error}))   
    })
    .catch(error => res.status(500).json({error}))
}