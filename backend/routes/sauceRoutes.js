//plugin externe pour utiliser le router d'Express
const express = require('express');
const router = express.Router();

// Importation du controller
const ctrlSauces = require('../controllers/saucesControllers');

// Ajout des middleweares
const auth = require('../middleware/auth');// Récupère la configuration d'authentification JsonWebToken
const multer = require('../middleware/multer-config');//Récupère le middleware multer pour la gestion des images

// Création des ROUTES de l'API en précisant leurs middlewares et controllers
router.post('/', auth, multer, ctrlSauces.createSauce);// Créer une sauce
router.get('/:id', auth, ctrlSauces.getOneSauce);// Sélection d'une sauce
router.get('/', auth, ctrlSauces.getAllSauces);//Récupération de toutes les sauces
router.put('/:id', auth, multer, ctrlSauces.modifySauce);//Modification d'une sauce
router.delete('/:id', auth, ctrlSauces.deleteSauce);//Suppression d'une sauce
router.post('/:id/like', auth, ctrlSauces.likeSauce);//Gestion des likes et dislikes

module.exports = router;
