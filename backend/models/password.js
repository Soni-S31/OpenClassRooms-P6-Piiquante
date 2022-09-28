// appelle de password validator 
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();

//modele du mot de passe
passwordSchema
    .is().min(8) //longeur mini : 8
    .has().uppercase()// au moins une majuscule
    .has().lowercase()// au moins une minuscule
    .has().digits()//au moins un chiffre
    .has().not().spaces()//pas d'espace
    .is().not().oneOf(['Passw0rd', 'Password123'])//valeurs proscrites


module.exports = passwordSchema;