const mongoose = require('mongoose'); //imporation de mongoose
const uniqueValidator = require('mongoose-unique-validator'); // package qui valide l'unicité de l'email
const mongodbErrorHandler = require('mongoose-mongodb-errors'); // plugin pour transformer les erreurs type mongodb en instance Mongoose ValidationError

mongoose.plugin(mongodbErrorHandler);

// Création du schéma de données pour l'utilisateur
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongodbErrorHandler);
//export du schema de donnée pour utiliser le modèle user
module.exports = mongoose.model('User', userSchema);
