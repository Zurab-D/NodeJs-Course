const request = require('co-request');
const { expect } = require('chai');
const config = require('config');

const app = require('../app');

describe('simple server tests', () => {
  let server;

  before('start server', function* () {
    yield new Promise(resolve => {
      server = app.listen(config.get('server.port'), resolve);
    });
  });
  after('stop current server', function* () {
    yield new Promise(resolve => server.close(resolve));
  });

  describe('GET /', () => {
    it('should return an index.html page', function* () {
      const response = yield request.get(
        `http://localhost:${config.server.port}`
      );

      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
    });
  });
});
