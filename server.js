const api = require("./app/routes/api");
const login = require("./app/routes/apiLogin")
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(cors())
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization,x-access-token, User-Agent, Referer, Accept');
//     next();
// })

app.use(morgan('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(express.static(__dirname + '/public'));

var apiLogin = login(app,express);
app.use('/auth', apiLogin);

var apiRouter = api(app, express);
app.use('/api', apiRouter);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/view/index.html'));
});

app.listen(config.port);
console.log('Dang dung port:' + config.port);
