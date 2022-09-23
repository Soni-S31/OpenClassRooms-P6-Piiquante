//Require
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Sauce = require('./models/sauceModels');

//Sécurité
const helmet = require('helmet'); //helmet sécurise en définissant divers en-têtes HTTP
const mongoSanitize = require('express-mongo-sanitize'); //Nettoie les données fournies par l'utilisateur pour empeché l'injection
const morgan = require('morgan'); // journalisation de requêtes HTTP
const rateLimit = require('express-rate-limit'); // pour limiter les demandes répétées aux API
const hpp = require('hpp'); //pour se protéger contre les attaques des paramètres HTTP
const dotenv = require('dotenv').config(); //variable d'environnement pour definir des mots de passe

//routes
const userRoutes = require('./routes/userRoutes');
const sauceRoutes = require('./routes/sauceRoutes');

//Express
app.use(express.json());

//Connection MongoDB
mongoose
    .connect(
        'mongodb+srv://newUser31:NewUser31@cluster0.qxb6ymk.mongodb.net/?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Définition des en-têtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATH, OPTIONS'
    );
    next();
});

//Sécurité
app.use(helmet());

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 100, // Limite chaque IP à 100 requêtes par `window` (ici, par 30 minutes)
});
app.use(limiter);

//Sécurité

app.use(mongoSanitize());
app.use(morgan('combined'));
app.use(hpp());

//enregistrement des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
