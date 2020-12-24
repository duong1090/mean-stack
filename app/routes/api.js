var User = require('../models/user');
var Movie = require('../models/movie');
var jwt = require('jsonwebtoken');
var config = require('../../config');
const multer = require('multer');

var superSecret = config.secret;


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`)
    },
});
const upload = multer({ storage: storage });

module.exports = function (app, express) {
    
    var apiRouter = express.Router();
    
    apiRouter.use('/uploads', express.static('uploads'));
    
    // route to login a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/login', function (req, res) {
        console.log(req.body.username);
        
        // find the user
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {
            
            if (err) throw err;
            
            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {
                
                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        name: user.name,
                        username: user.username
                    }, superSecret, {
                        expiresIn: '24h' // expires in 24 hours
                    });
                    
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
                
            }
            
        });
    });
    // create a user (accessed at POST http://localhost:8080/users)
    apiRouter.route('/users/create').post(function (req, res) {
        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;  // set the users name (comes from the request)
        user.username = req.body.username;  // set the users username (comes from the request)
        user.password = req.body.password;  // set the users password (comes from the request)
        user.save(function (err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: err.message });
                else
                    return res.send(err);
            }
    
            // return a message
            res.json({ message: 'User created!' });
        });
    })
    
    // route middleware to verify a token
    // apiRouter.use(function (req, res, next) {
    //     // do logging
    //     console.log('Somebody just came to our app!');

    //     // check header or url parameters or post parameters for token
    //     var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //     // decode token
    //     if (token) {

    //         // verifies secret and checks exp
    //         jwt.verify(token, superSecret, function (err, decoded) {
    //             if (err)
    //                 return res.json({ success: false, message: 'Failed to authenticate token.' });
    //             else
    //                 // if everything is good, save to request for use in other routes
    //                 req.decoded = decoded;
    //         });

    //     } else {

    //         // if there is no token
    //         // return an HTTP response of 403 (access forbidden) and an error message
    //         return res.status(403).send({
    //             success: false,
    //             message: 'No token provided.'
    //         });

    //     }

    //     next(); // make sure we go to the next routes and don't stop here
    // });

    // accessed at GET http://localhost:8080/api
    apiRouter.use(function (req, res, next) {
        console.log("Main");
        next();
    });
    apiRouter.get('/', function (req, res) {
        res.json({ message: 'Hello! Welcom to our API' });
    });
    // on routes that end in /users
    // ----------------------------------------------------


    //====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R 
    //apiRouter.route('/users')
    // get all the users (accessed at GET http://localhost:8080/api/users)
    apiRouter.route('/users/list').get(function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(err);

            // return the users
            res.json(users);
        });
    });
    // apiRouter.route('/users/:user_id')
    // get the user with that id
    apiRouter.route('/users/:user_id').get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) res.send(err);

            // return that user
            res.json(user);
        });
    })
    // update the user with this id
    apiRouter.route('/users/:user_id').put(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {

            if (err) res.send(err);

            // set the new user information if it exists in the request
            if (req.body.name) user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;

            // save the user
            user.save(function (err) {
                if (err) res.send(err);

                // return a message
                res.json({ message: 'User updated!' });
            });

        });
    })
    // delete the user with this id
    apiRouter.route('/users/:user_id').delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err) res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

    //====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E 
    apiRouter.post('/movie/create', upload.single("image"), (req, res) => {
        const movie = new Movie({
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            caregory: req.body.caregory,
            status: req.body.status,
            image: req.file.filename
        })
        movie.save((err, doc) => {
            if (err) return res.json({ success: false, err });
            let ress = doc;
            ress.id = doc._id;
            res.status(200).json({
                success: true,
                data: ress
            })
        })
    })

    apiRouter.get('/movie/list', (req, res) => {
        Movie.find({}, (err, movie) => {
            if (err) return res.status(400).send(err);
            res.status(200).send(movie)
        })
    })

    apiRouter.route('/movie/detail/:movie_id').get(function (req, res) {
        Movie.findById(req.params.movie_id, function (err, movie) {
            if (err)
                res.send(err);
            else
                res.json({ message: 'User detail!', data: movie });
        });

    });

    apiRouter.post('/movie/update', upload.single("image"), (req, res) => {
        Movie.findById(req.body.id, function (err, movie) {
            if (err) res.send(err);
            console.log("bodyyyyyyyyyyyyyyyyyy", req.body, movie);
            if (req.body.name) movie.name = req.body.name;
            if (req.body.price) movie.price = req.body.price;
            if (req.body.amount) movie.amount = req.body.amount;
            if (req.body.description) movie.description = req.body.description;
            if (req.body.manufacturer) movie.manufacturer = req.body.manufacturer;
            if (req.body.caregory) movie.caregory = req.body.caregory;
            if (req.body.status) movie.status = req.body.status;
            if (req.body.image) movie.image = req.file.filename;

            movie.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                let ress = doc;
                ress.id = doc._id;
                res.status(200).json({
                    success: true,
                    data: ress
                })
            })
        })
    });

    apiRouter.route('/movie/update').post(function (req, res) {
        Movie.findById(req.body.id, function (err, movie) {
            if (err)
                res.send(err);
            else
                console.log("bodyyyyyyyyyyyy", req);
            res.json({ message: 'User detail!', data: req.body });
        });

    });

    apiRouter.route('/movie/delete/:movie_id').post(function (req, res) {
        // console.log(req)
        console.log("idddddddddddddddddd", req.params.movie_id)
        Movie.deleteOne({
            _id: req.params.movie_id
        }, function (err, movie) {
            if (err)
                res.send(err);
            res.json({
                status: "success",
                data: 'Movie deleted'
            });
        });
    })


    return apiRouter;
};
