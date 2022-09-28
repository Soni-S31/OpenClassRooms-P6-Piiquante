//récupération du modèle 'sauce'
const Sauce = require('../models/sauceModels');
// Récupération du module 'file system' de Node qui permet de gérer les téléchargements et modifications d'images
const fs = require('fs');

//__________________Création nouvelle sauce
exports.createSauce = (req, res, next) => {

    // Stocke les données envoyées par le front-end sous forme de form-data en les transformant en objet js
    const sauceObject = JSON.parse(req.body.sauce);
    // Supprime l'id généré et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    delete sauceObject._id;
    //Création instance du modèle Sauce
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        //Modifie l'URL de l'image 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename
            }`,
    });
    sauce.likes = 0;
    sauce.dislikes = 0;
    //Sauvegarde de la sauce dans la base 
    sauce
        .save()

        .then(() => {
            res.status(201).json({ message: 'Sauce enregistrée !' });
        })

        .catch((error) => {
            res.status(400).json({ error });
        });
};

//___________________________Modifier une sauce
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // si image modifiée, il faut supprimer l'ancienne image dans le dossier /images
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                //controle si l'utilisateur est le créateur ou si la sauce existe dans la base
                if (sauce.userId != req.auth.userId) {
                    res.status(403).json({ message: 'Unauthorized request' });
                    if (!sauce) {
                        res.status(404).json({ error: 'Sauce inexistante' });
                    }
                } else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        // une fois l'ancienne image supprimée dans le dossier /images on met à jour 
                        const sauceObject = {
                            ...JSON.parse(req.body.sauce),
                            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        }
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                            .catch(error => res.status(400).json({ error }));
                    });
                }
            })

            .catch(error => res.status(500).json({ error }));
    } else {
        // si image non modifiée
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};


//_______________________________Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //controle si l'utilisateur est le créateur ou si la sauce existe dans la base
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' });
                if (!sauce) {
                    res.status(404).json({ error: 'Sauce inexistante' });
                }
            } else {
                //on récupère l'URL de la sauce, on supprime le nom du fichier et on le supprime
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    //on supprime la sauce de la base
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Sauce supprimée !'
                            });

                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

//___________________________Récupère une sauce
exports.getOneSauce = (req, res, next) => {
    // Méthode findOne en passant l'objet de comparaison(id de la sauce doit être le même que le paramètre de requête)
    Sauce.findOne({ _id: req.params.id })
        // Si ok on retourne une réponse et l'objet
        .then((sauce) => res.status(200).json(sauce))
        // sinon génére une erreur indiquant que l'objet n'est pas trouvé
        .catch((error) => res.status(404).json({ error }));
};

//___________________________Récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // Méthode find pour obtenir la liste complète des sauces de la base
    Sauce.find()
        // Si OK on retourne un tableau de toutes les données
        .then((sauce) => res.status(200).json(sauce))
        // Si erreur on retourne un message d'erreur
        .catch((error) => res.status(400).json({ error }));
};

//____________________________Like ou Dislike
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    // bouton j'aime
    if (like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Like ajouté' }))
            .catch(error => res.status(400).json({ error }))
        // bouton je n'aime pas
    } else if (like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
            .catch(error => res.status(400).json({ error }))

        // annulation du bouton j'aime ou alors je n'aime pas
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Like supprimé' }))
                        .catch(error => res.status(400).json({ error }))
                }

                else if (sauce.usersDisliked.indexOf(userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Dislike supprimé' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};
