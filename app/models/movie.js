var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var MovieSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    manufacturer: { type: String, required: true },
    caregory: { type: String, required: true },
    status: { type: Number, required: true },
    image: { type: String, required: true },
})

module.exports = mongoose.model('Movie', MovieSchema);