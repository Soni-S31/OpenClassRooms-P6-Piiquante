//plugin externe pour utiliser le router d'Express
const express = require('express');
const router = express.Router();

// Importation du controller
const userCtrl = require('../controllers/userControllers');

// Création des ROUTES de l'API en précisant leurs middlewares et controllers
router.post('/signup', userCtrl.signup); // Création d'un utilisateur : Chiffre le mp de l'utilisateur et ajoute l'utilisateur à la base de données
router.post('/login', userCtrl.login);//Contrôle les infos d'identification pour que l'utilisateur se connecte

module.exports = router;
