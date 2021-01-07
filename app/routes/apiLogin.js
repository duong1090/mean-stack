var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var User = require('../models/user');
var superSecret = config.secret;

const time_expire = '180s'

module.exports = function (app, express) {
    var apiRouter = express.Router();
    // route to login a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/login', function (req, res) {
        console.log(req.body.username);

        if (req.body && req.body.provider == 'LOCAL') {
            // find the user
            User.findOne({
                username: req.body.username
            }).select('name username password').exec(function (err, user) {
                if (err) throw err;
                // no user with that username was found
                if (!user) {
                    return res.json({
                        success: false,
                        message: 'Authentication failed. User not found.'
                    });
                } else if (user) {
                    // check if password matches
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        return res.json({
                            success: false,
                            message: 'Authentication failed. Wrong password.'
                        });
                    } else {
                        // if user is found and password is right
                        // create a token
                        var token = jwt.sign({
                            name: user.name,
                            id: user.id
                        }, superSecret, {
                            expiresIn: '15s' // expires in 24 hours
                        });
                        // return the information including token as JSON
                        return res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    }
                }
            });
        }
        else if (req.body && req.body.provider == 'FACEBOOK') {
            User.findOne({ facebookId: req.body.id })
                .then((existingUser) => {
                    if (existingUser) {
                        var token = jwt.sign({
                            name: existingUser.name,
                            id: existingUser.id
                        }, superSecret, {
                            expiresIn: time_expire // expires in 24 hours
                        });
                        // return the information including token as JSON
                        console.log('userrrrr', existingUser)
                        return res.send({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    } else {
                        new User({
                            facebookId: req.body.id,
                            email: req.body.email,
                            name: req.body.name,
                            username: req.body.email
                        })
                            .save()
                            .then(user => {
                                var token = jwt.sign({
                                    name: user.name,
                                    id: user.id
                                }, superSecret, {
                                    expiresIn: time_expire // expires in 24 hours
                                });
                                // return the information including token as JSON
                                return res.send({
                                    success: true,
                                    message: 'Enjoy your token!',
                                    token: token
                                });
                            });
                    }
                })
        }
        else if (req.body && req.body.provider == 'GOOGLE') {
            User.findOne({ googleId: req.body.id })
                .then((existingUser) => {
                    if (existingUser) {
                        var token = jwt.sign({
                            name: existingUser.name,
                            id: existingUser.id
                        }, superSecret, {
                            expiresIn: time_expire // expires in 24 hours
                        });

                        // return the information including token as JSON
                        console.log('userrrrr', existingUser)
                        return res.send({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    } else {
                        new User({
                            googleId: req.body.id,
                            email: req.body.email,
                            name: req.body.name,
                            username: req.body.email
                        })
                            .save()
                            .then(user => {
                                var token = jwt.sign({
                                    name: user.name,
                                    id: user.id
                                }, superSecret, {
                                    expiresIn: time_expire // expires in 24 hours
                                });
                                // return the information including token as JSON
                                return res.send({
                                    success: true,
                                    message: 'Enjoy your token!',
                                    token: token
                                });
                            });
                    }
                })
        }
        else return res.json({
            success: false,
            message: 'Authentication failed. User not found.'
        });
    });
    //////////////////// LOGIN GOOOLE
    return apiRouter;
};
