const config = require('config');
const app = require('./app');
const socket = require('libs/socket');

const port = config.get('server.port')

const server = app.listen(port, () => {
  console.log(`server listen on 0.0.0.0:${port}`);
});

socket(server);
