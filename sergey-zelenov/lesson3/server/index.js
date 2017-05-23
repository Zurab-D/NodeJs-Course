'use strict';

const config = require('config');
const host = 'localhost';
const port = '3000';

const server = require('./server');

server.listen(port, host, () => console.log(`http://${host}:${port}`));
