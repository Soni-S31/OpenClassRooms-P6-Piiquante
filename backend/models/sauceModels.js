const mongoose = require('mongoose');//imporation de mongoose
const mongodbErrorHandler = require('mongoose-mongodb-errors');// plugin pour transformer les erreurs type mongodb en instance Mongoose ValidationError

//Création du schema mangoose (pour que les données de la base MongoDB soient identiques au schema Model sauce)
// L'Id est généré par MongoDB
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: [{ type: String }],
    usersDisliked: [{ type: String }],
});

sauceSchema.plugin(mongodbErrorHandler);
//export du schema de données pour utiliser le modèle sauce
module.exports = mongoose.model('Sauce', sauceSchema);
