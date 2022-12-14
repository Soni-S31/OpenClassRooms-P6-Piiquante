const bcrypt = require('bcrypt'); // Algorithme bcrypt pour hasher le mot de passe
const jwt = require('jsonwebtoken'); // Package jsonwebtoken pour attribuer un token à un utilisateur au moment où il se connecte
require('dotenv').config();

const User = require('../models/userModels'); //Récupération du modèle User
const passwordSchema = require('../models/password')//récupération du modèle de mot de passe



// Middleware pour crée un nouvel utilisateur
exports.signup = (req, res, next) => {
    // vérification du schéma mot de passe
    const validePassword = passwordSchema.validate(req.body.password);
    // si le mot de passe est bon
    validePassword === true; {
        // fonction pour hasher/crypter le mot de passe
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                // créer un modele User avec mot de pase hashé
                const user = new User({
                    email: req.body.email,
                    password: hash,
                });
                // sauvegarde le user dans la base de donnée
                user
                    .save()
                    .then(() =>
                        res
                            .status(201)
                            .json({ message: "Utilisateur créé !" })
                    )
                    // si erreur MP  
                    .catch((error) => res.status(400).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));

    }
};

// Middleware pour la connexion d'un utilisateur : vérifie si l'utilisateur existe dans la base MongoDB lors du login
//si oui, contrôle du mot de passe et renvoie un TOKEN contenant l'id de l'utilisateur, sinon renvoie une erreur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
                            expiresIn: '24h'
                        }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
