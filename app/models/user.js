var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
// mongoose.connect('mongodb+srv://Nhocga123:Nhocga123@cluster0.u7vq9.mongodb.net/DemoMongo?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
var UserSchema=new Schema({
    name: {type:String ,required:true},
    username: {type:String ,required:true, index:{unique:true}},
    password:{type:String},
})

UserSchema.methods.comparePassword = function(tempPassword) {
    const user = this;
    if(user.password.trim() == tempPassword.trim())
    {
        return true;
    }
    else {
        return false;
    }

}

module.exports=mongoose.model('User',UserSchema);