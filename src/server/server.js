const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyparser = require('body-parser');

const routes = require('./routes/routes');
const server = express();

const abspath = path.dirname(__filename);

// Setup nunjucks template engine
nunjucks.configure(abspath+'/views', {
    autoescape:true,
    express: server
});

// Set nunjucks as default template engine for express
server.set('view engine', 'nunjucks');

// Setup body-parser to parse json requests
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({extended:true}));

// Set the default routes
server.use('/', routes);

// Setup the public folder as static
const public_dir = path.resolve(abspath+'/../../public');
server.use(express.static(public_dir));

// catch 404 and forward to error handler
server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
    server.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

module.exports = server;
