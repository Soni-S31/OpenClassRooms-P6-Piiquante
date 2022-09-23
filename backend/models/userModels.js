const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors'); // plugin pour transformer les erreurs type mongodb en instance Mongoose ValidationError

mongoose.plugin(mongodbErrorHandler);

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('User', userSchema);
