// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/ our database
var config = require('./config');
var path = require('path');

// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Origin', 'GET, POST');
	res.setHeader('Access-Control-Allow-Origin', 'X-Requested-With,content-type,Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));


// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API
// =============================
// basic route for the home page
// app.get('/', function(req, res) {
// 	res.send('Welcome to the home page!');
// });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// START THE SERVER
// ===============================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);





