const { json } = require("express");
const Sauce = require("../models/sauce"); 
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
        
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    })
  
    sauce.save()
        .then(() => {
            res.status(201).json({ message: 'Objet enregistré !'})
        })
        .catch(error => res.status(400).json({ error }));
}

exports.getAllSauce = (req, res, next) => {

    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}))
}

exports.getOneSauce = (req, res, next) => {

    Sauce.findOne({_id: req.params.id})
    .then(find => {
        res.status(200).json(find)})
    .catch(error => res.status(404).json({error}))
}

exports.updateSauce = (req, res, next) => {

    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => { 
            console.log("ok");
            res.status(201).json({message: "La sauce a bien été modifié"})})
        .catch(error => {
            console.log("ok2");
            res.status(400).json({error})})
}

exports.deleteSauce = (req, res, next) => {
    
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.like = (req, res, next) => {

    const sauceId = req.url.split("/")[1];
    if(req.body.like === 1) {

        Sauce.findOne({_id: sauceId})
        .then(sauce => {

            for(i = 0; i < sauce.usersDisliked.length; i++) {

                if(sauce.usersDisliked[i] === req.body.userId) {
                    
                    sauce.usersDisliked.splice(i, 1);
                    sauce.dislikes--;  
                }
            }
            sauce.usersLiked.push(req.body.userId)
            sauce.likes++;
            sauce.save()
            res.status(200).json({message: "Vous avez liké cette sauce"})
        })
    }

    if(req.body.like === -1) {

        Sauce.findOne({_id: sauceId})
        .then(sauce => {
            
            for(i = 0; i < sauce.usersLiked.length; i++) {

                if(sauce.usersLiked[i] === req.body.userId) {
            
                    sauce.usersLiked.splice(i, 1);
                    sauce.likes--;
                }
            }
            sauce.usersDisliked.push(req.body.userId)
            sauce.dislikes++;
            sauce.save()
            res.status(200).json({message: "Vous avez disliké cette sauce"})
        })
    }

    if(req.body.like === 0) {
        Sauce.findOne({_id: sauceId})
        .then(sauce => {

            for(i = 0; i <= sauce.usersDisliked.length; i++) {

                if(sauce.usersDisliked[i] === req.body.userId) {
                    sauce.usersDisliked.splice(i, 1);
                    sauce.dislikes--;
                    sauce.save()
                    res.status(200).json({message: "dislike enlevé"});
                }
            }
            for(i = 0; i < sauce.usersLiked.length; i++) {

                if(sauce.usersLiked[i] === req.body.userId) {
                    
                    sauce.usersLiked.splice(i, 1);
                    sauce.likes--;
                    sauce.save()
                    res.status(200).json({message: "like enlevé"});
                }
            }
        })
    }
}
