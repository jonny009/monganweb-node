var template_engine = 'dust',
    domain = 'localhost';

var express = require('express'),
    dust = require('dustjs-linkedin'),
    cons = require('consolidate'),
    routes = require('./routes'),
    http = require('http'),
    // store = new express.session.MemoryStore,
    path = require('path');
    // bodyParser = require('body-parser'),
    // methodOverride = require('method-override'),
    // cookieParser = require('cookie-parser'),
    // session = require('express-session'),
    // errorhandler = require('errorhandler'),
    // favicon = required('server-favicon'),
    // logger = require('morgan');

var app = express();

app.engine('dust', cons.dust);

app.set('template_engine', template_engine);
app.set('domain', domain);
app.set('port', process.env.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', template_engine);

// app.use(favicon());
// app.us(logger('dev'));
// app.use(bodyParser());
// app.use(methodOverride());
// app.use(express.cookieParser('wigglybits'));
// app.use(express.session({ secret: 'whatever', store: store }));
// app.use(express.session());

app.use(require('less-middleware')(path.join(__dirname + '/public')));
app.use('/public/css', express.static(__dirname + '/public/css'));
app.use('/public/scripts', express.static(__dirname + '/public/scripts'));
app.use('/public/images', express.static(__dirname + '/public/images'));
app.use('/public/font', express.static(__dirname + '/public/font'));

// app.locals.inspect = require('util').inspect;
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});