'use strict';

const request = require('request');
const path = require('path');
const fs = require('fs-extra');

const server = require('./server');

const filesDirectory = path.resolve('../files');
const host = '127.0.0.1';
const port = '3333';
const url = `http://${host}:${port}`;
const fixtures = `${__dirname}/fixtures`;

describe('server tests', () => {
  before('start server', done => {
    server.listen(port, host, done);
  });
  after('stop current server', done => {
    server.close(done);
  });
  beforeEach('clean server files folder', () => {
    fs.emptyDirSync(filesDirectory);
  });

  describe('GET requests', () => {
    describe('get /file.ext', () => {
      context('when exists', () => {
        beforeEach('copy file to files directory', () => {
          fs.copySync(
            `${fixtures}/small.png`,
            `${filesDirectory}/small.png`
          );
        });

        it('returns 200 & the file', done => {
          const content = fs.readFileSync(`${fixtures}/small.png`);

          request.get(`${url}/small.png`, (error, response, body) => {
            if (error) return done(error);
            expect(response.statusCode).to.equal(200);
            expect(body).to.deep.equal(content);
            done();
          });
        });
      });

      context('when does not exist', () => {
        it('returns 404', done => {
          request.get(`${host}/small.png`, (error, response, body) => {
            if (error) return done(error);
            expect(response.statusCode).to.equal(404);
            done();
          });
        });
      });
    });

    describe('get /nested/paths', () => {
      it('returns 400', done => {
        request.get(`${url}/nested/path`, (error, response) => {
          if (error) return done(error);
          expect(response.statusCode).to.equal(400);
          done();
        });
      });
    });
  });

  describe('POST requests', () => {
      context('When exists', () => {
        beforeEach('copy file into files directory', () {
          fs.copySync(
            `${fixtures}/small.png`,
            `${filesDirectory}/small.png`
          );
        });

        context('When small file size', () => {
          it('returns 409 & file not modified', done => {
            const { mtime } = fs.statSync(`${filesDirectory}/small.png`);

            const req = request.post(`${url}/small.png`, (error, response) => {
              if (error) return done(error);

              const { mime: newMtime } = fs.statSync(`${filesDirectory}/small.png`);

              // eql compares dates the right way
              expect(mtime).to.equal(newMtime);

              expect(response.statusCode).to.equal(409);
              done();
            });

            fs.createReadStream(`${fixturesRoot}/small.png`).pipe(req);
          });

          context('When zero file size', () => {
            it('returns 409', done => {
              const req = request.post(`${url}/small.png`, (error, response) => {
                if (error) return done(error);

                expect(response.statusCode).to.equal(409);
                done();
              });

              const stream = new Readable();

              stream.pipe(req);
              stream.push(null);
            });
          });
        });

        context('When too big', () => {
          it('return 413', done => {
            const req = request.post(`${url}/big.png`, (error, response) => {
              if (error) return done(error);
              expect(response.statusCode).to.equal(413);
              done();
            });

            fs.createReadStream(`${fixtures}/big.png`).pipe(req);
          });
        });
      });

      context('otherwise with zero file size', () => {
        it('returns 200 & file is uploaded', done => {
          const req = request.post(`${url}/small.png`, error => {
            if (error) return done(error);

            const { size } = fs.statSync(`${filesDirectory}/small.png`);
            expect(size).to.equal(0);
            done();
          });

          const stream = new Readable();

          stream.pipe(req);
          stream.push(null);
        });

      });

      context('otherwise', () => {
        it('returns 200 & file is uploaded', done => {
          const req = request.post(`${url}/small.png`, error => {
            if (error) return done(error);

            const content = fs.readFileSync(`${filesDirectory}/small.png`);

            expect(content)
              .to.deep.equal(fs.readFileSync(`${fixtures}/small.png`));

            done();
          });

          fs.createReadStream(`${fixtures}/small.png`).pipe(req);
        });
      });
  });
});
