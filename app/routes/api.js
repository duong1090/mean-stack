var User = require('../models/user');
var Movie = require('../models/movie');
var jwt = require('jsonwebtoken');
var config = require('../../config');
const multer = require('multer');
var User = require('../models/user')
var passport = require('passport')

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


    // route middleware to verify a token
    apiRouter.use(function (req, res, next) {
        // do logging
        console.log('Somebody just came to our app!');
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err)
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                else
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                next(); // make sure we go to the next routes and don't stop here
            });
        } else {
            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            return res.json({
                success: false,
                message: 'No token provided.'
            });
        }
    });


    apiRouter.post('/movie/create', upload.single("image"), (req, res) => {
        console.log('createcreatecreatereq', req)
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
        if (movie)
            movie.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                let ress = doc;
                ress.id = doc._id;
                return res.status(200).json({
                    success: true,
                    data: ress
                })
            })
        else return res.json({
            success: false,
            message: "Dữ liệu trống!"
        })
    })

    apiRouter.post('/movie/update', upload.single("image"), (req, res) => {
        Movie.findById(req.body.id, function (err, movie) {
            if (err)
                return res.json(err);
            if (req.body.name) movie.name = req.body.name;
            if (req.body.price) movie.price = req.body.price;
            if (req.body.amount) movie.amount = req.body.amount;
            if (req.body.description) movie.description = req.body.description;
            if (req.body.manufacturer) movie.manufacturer = req.body.manufacturer;
            if (req.body.caregory) movie.caregory = req.body.caregory;
            if (req.body.status) movie.status = req.body.status;
            if (req.file.filename) movie.image = req.file.filename;

            if (movie) {
                console.log("bodyyyyyyyyyyyyyyyyyy", req.body, movie);
                movie.save((err, doc) => {
                    if (err) return res.json({ success: false, err });
                    let ress = doc;
                    ress.id = doc._id;
                    return res.json({
                        success: true,
                        data: ress
                    })
                })

            }
            else return res.json({
                success: false,
                message: "Dữ liệu trống!"
            })
        })
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
                    return res.json(err);
            }

            // return a message
            return res.json({ message: 'User created!' });
        });
    })


    // accessed at GET http://localhost:8080/api
    apiRouter.use(function (req, res, next) {
        console.log("Main");
        next();
    });
    apiRouter.get('/', function (req, res) {
        return res.json({ message: 'Hello! Welcom to our API' });
    });
    // on routes that end in /users
    // ----------------------------------------------------


    //====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R ====== U S E R 
    //apiRouter.route('/users')
    // get all the users (accessed at GET http://localhost:8080/api/users)
    // apiRouter.route('/users/list').get(function (req, res) {
    //     User.find(function (err, users) {
    //         if (err) return res.json(err);

    //         // return the users
    //         return res.json(users);
    //     });
    // });
    // // apiRouter.route('/users/:user_id')
    // // get the user with that id
    // apiRouter.route('/users/:user_id').get(function (req, res) {
    //     User.findById(req.params.user_id, function (err, user) {
    //         if (err) return res.json(err);

    //         // return that user
    //         return res.json(user);
    //     });
    // })
    // // update the user with this id
    // apiRouter.route('/users/:user_id').put(function (req, res) {
    //     User.findById(req.params.user_id, function (err, user) {

    //         if (err) return res.json(err);

    //         // set the new user information if it exists in the request
    //         if (req.body.name) user.name = req.body.name;
    //         if (req.body.username) user.username = req.body.username;
    //         if (req.body.password) user.password = req.body.password;

    //         // save the user
    //         user.save(function (err) {
    //             if (err) return res.json(err);

    //             // return a message
    //             return res.json({ message: 'User updated!' });
    //         });

    //     });
    // })
    // // delete the user with this id
    // apiRouter.route('/users/:user_id').delete(function (req, res) {
    //     User.remove({
    //         _id: req.params.user_id
    //     }, function (err, user) {
    //         if (err) return res.json(err);

    //         return res.json({ message: 'Successfully deleted' });
    //     });
    // });

    //====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E ====== M O V I E 


    apiRouter.get('/movie/list', (req, res) => {
        Movie.find({}, (err, movie) => {
            if (err)
                return res.json(err)
            else
            return res.json(movie)
        })
    })

    apiRouter.route('/movie/detail/:movie_id').get(function (req, res) {
        Movie.findById(req.params.movie_id, function (err, movie) {
            if (err)
                return res.json(err);
            else
                return res.json({ message: 'User detail!', data: movie });
        });

    });


    apiRouter.route('/movie/update').post(function (req, res) {
        Movie.findById(req.body.id, function (err, movie) {
            if (err)
                return res.json(err);
            else
                console.log("bodyyyyyyyyyyyy", req);
            return res.json({ message: 'User detail!', data: req.body });
        });

    });

    apiRouter.route('/movie/delete').post(function (req, res) {
        // console.log(req)
        console.log("idddddddddddddddddd", req.params.movie_id)
        Movie.deleteOne({
            _id: req.body.id
        }, function (err, movie) {
            if (err)
                return res.json(err);
            return res.json({
                status: "success",
                data: 'Movie deleted'
            });
        });
    })


    return apiRouter;
};
