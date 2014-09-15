
/**
 * Module dependencies
 */

// Allows to require JSON5 files.
require('json5/lib/require');

var express = require('express'),
    env     = process.env.NODE_ENV || 'development',
    config  = require('./config/config')[env];

var app = express();

// Bootstrap application settings
require('./config/express')(app, config);

var port = process.env.PORT || 3001;

app.listen(port);
console.log('Express app started on port '+ port);

// Expose app
module.exports = app;
