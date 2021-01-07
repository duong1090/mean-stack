var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    email: { type: String },
})

UserSchema.methods.comparePassword = function (tempPassword) {
    const user = this;
    if (user.password.trim() == tempPassword.trim()) {
        return true;
    }
    else {
        return false;
    }

}

module.exports = mongoose.model('User', UserSchema);