const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors'); // plugin pour transformer les erreurs type mongodb en instance Mongoose ValidationError

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

sauceSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Sauce', sauceSchema);
