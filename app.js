/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('express-error-handler'),
  session = require('express-session'),
  morgan = require('morgan'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  pixnet = require('./routes/pixnet')
  _ = require('underscore');

var app = module.exports = express();

/**
 * Configuration
 */
 
function allowCrossDomain(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  var origin = req.headers.origin;
  if (_.contains(app.get('allowed_origins'), origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}
app.set('ipaddress',  "127.0.0.1")
app.set('port',  process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'pixnet hackathon',
  resave: false,
  saveUninitialized: true
}))

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/button', routes.button);
app.get('/listusers', pixnet.listUsers);
app.get('/plogin', pixnet.getAuthUrl);
app.get('/callback', pixnet.callback);
app.get('/permission', pixnet.permission);
app.get('/checkuser', pixnet.checkUser);
app.get('/getidbyname', pixnet.getIdByName);
app.post('/submitpost', pixnet.submitPost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), app.get('ipaddress'),function () {
  console.log('Express server listening on '+app.get('ipaddress')+":" + app.get('port'));
});