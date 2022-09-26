const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //recherche du Token des entêtes d'autorisation
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //Vérifie si cela correspond à la clé de jeton secrète
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
