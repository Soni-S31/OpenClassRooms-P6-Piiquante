const jwt = require('jsonwebtoken'); // Récupération du package jsonwebtoken

//Middleware de contrôle utilisé pour protéger toutes les routes pour les sécuriser
//(contrôle du TOKEN de l'utilisateur par rapport à l'ID dans la requete)
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //recherche du Token des entêtes d'autorisation
        const decodedToken = jwt.verify(token, process.env.TOKEN); //Vérifie si cela correspond à la clé du token
        const userId = decodedToken.userId;
        console.log('id from Auth');
        console.log(userId);
        req.auth = { userId };
        next();
    } catch (error) {
        res.status(401).json({
            error: new Error('Requête non authentifiée !'),
        });
    }
};
