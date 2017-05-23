'use strict';

const request = require('request');
const config = require('config');

const server = require('./server');

const port = config.get('port');

describe('server', () => {
  before('start server', () => {
    server.listen(port);
  });

  after('close server', () => {
    server.close();
  });

  it('should return 200', (done) => {
    request(`http://localhost:${port}`, (error, response, body) => {
      if (error) done(error);
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});
