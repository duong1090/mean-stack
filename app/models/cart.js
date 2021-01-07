var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var CartSchema = new Schema({
    user_id: { type: String, required: true },
    prod_id: { type: String, required: true },
    count: { type: Number, required: true }
})

module.exports = mongoose.model('Cart', CartSchema);