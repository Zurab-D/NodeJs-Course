/**
* A "closer to real-life" app example
* using 3rd party middleware modules
* P.S. MWs calls be refactored in many files
*/

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const config   = require('config');
const mongoose = require('./libs/mongoose');
const socket   = require('./libs/socket');
const koa      = require('koa');
const app      = koa();


// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

// Middlewares
require('./middlewares')(app);

// Init CSRF
require('koa-csrf')(app);

// Routes
require('./routes')(app);


const server = app.listen(config.port, config.host, console.log(`http://${config.host}:${config.port}`));

socket(server);
