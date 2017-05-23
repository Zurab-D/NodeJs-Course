'use strict';

const app = require('./app');
const config = require('config');

app.listen(config.port, config.host, console.log(`http://${config.host}:${config.port}`));
