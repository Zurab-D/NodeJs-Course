'use strict';

const { expect } = require('chai');

const request = require('request');
const path = require('path');
const fs = require('fs-extra');
const mime = require('mime');

const server = require('../server');

const host = '127.0.0.1';
const port = '3333';
const url = `http://${host}:${port}`;

const filesDirectory = filesDir;
const fixtures = `${__dirname}\\fixtures`;

const SMALL_IN_FIXTURES = `${fixtures}/small.png`;
const SMALL_IN_DESTINATION = `${filesDirectory}/small.png`;
const URL_SMALL = `${url}/small.png`;

const BIG_IN_FIXTURES = `${fixtures}/big.png`;
const BIG_IN_DESTINATION = `${filesDirectory}/big.png`;
const URL_BIG = `${url}/big.png`;


function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
};



describe('server tests', () => {
    before('server start', done => {
        server.listen(port, host, done);
    });
    after('server stop', done => {
        server.close(done);
    });
    beforeEach('clean server files folder', () => {
        if (!!rootDir && !!filesDirectory && filesDirectory.includes(rootDir)) {
            fs.emptyDirSync(filesDirectory);
        };
    });

    describe('GET request', () => {
        describe('get file.ext', () => {
            context('when exists', () => {
                beforeEach('copy file to files dir', () => {
                    fs.copySync(SMALL_IN_FIXTURES, SMALL_IN_DESTINATION);
                });

                it('returns 200 & the file', done => {
                    let content = fs.readFileSync(SMALL_IN_FIXTURES, {encoding: 'utf-8'});

                    request.get(URL_SMALL, (error, response, body) => {
                        if (error) return done(error);
                        expect(response.statusCode).to.equal(200);
                        expect(body).to.deep.equal(content);
                        done();
                    });
                });
            });

            context('when does NOT exists', () => {
                it('returns 404', done => {
                    request.get(URL_SMALL, (error, response, body) => {
                        if (error) return done(error);
                        expect(response.statusCode).to.equal(404);
                        done();
                    });
                });
            });
        });
    });

    describe('POST request', () => {
        describe('post file.ext', () => {
            context('when file does NOT exists on the server', () => {
                it('returns 200 & the file', done => {
                    let content = fs.readFileSync(SMALL_IN_FIXTURES, {encoding: 'utf-8'});

                    request.post({
                      url: URL_SMALL,
                      body: fs.createReadStream(SMALL_IN_FIXTURES),
                      headers: {
                        'Content-type': mime.lookup(SMALL_IN_FIXTURES),
                        'x-filename': 'small.png'
                      }
                    }, (error, response, body) => {
                        if (error) return done(error);
                        expect(response.statusCode).to.equal(200);

                        var data = fs.readFileSync(SMALL_IN_DESTINATION, {encoding: 'utf-8'});
                        if (!data) return done(error);

                        expect(data).to.deep.equal(content);
                        done();
                    });


                });
            });

            context('when file too BIG', () => {
                it('returns 413 & file does not exist', done => {
                    request.post({
                        url: URL_BIG,
                        body: fs.createReadStream(BIG_IN_FIXTURES),
                        headers: {
                            'Content-type': mime.lookup(BIG_IN_FIXTURES),
                            'x-filename': 'big.png'
                        }
                    }, (error, response, body) => {
                        if (error) return done(error);
                        expect(response.statusCode).to.equal(413);
                        fs.stat(BIG_IN_DESTINATION, (err) => {
                            expect(!!err).to.equal(true);
                            expect(err.code).to.equal('ENOENT');
                            done();
                        });
                    });
                });
            });

            context('when file EXISTS on the server', () => {
                let statBefor, statAfter;
                beforeEach('copy file to files dir', () => {
                    fs.copySync(SMALL_IN_FIXTURES, SMALL_IN_DESTINATION);
                    statBefor = fs.statSync(SMALL_IN_DESTINATION);
                    sleep(1000);
                });

                it('returns 409 & file modif.time is not changed', done => {
                    var formData = {
                        my_file: fs.createReadStream(SMALL_IN_FIXTURES),
                    };
                    request.post({url: URL_SMALL, formData: formData}, (error, response, body) => {
                        if (error) return done(error);
                        expect(response.statusCode).to.equal(409);

                        statAfter = fs.statSync(SMALL_IN_DESTINATION);
                        expect(!!statAfter).to.equal(true);
                        expect(statAfter.mtime+'').to.equal(statBefor.mtime+'');
                        done();
                    });
                });
            });
        });
    });

    describe('DELETE request', () => {
        describe('delete /file.ext', () => {
            context('when file EXISTS', () => {
                beforeEach('copy file to files dir', () => {
                    fs.copySync(SMALL_IN_FIXTURES, SMALL_IN_DESTINATION);
                });

                it('returns 200 & file does not exists', done => {
                    request.delete(URL_SMALL, (err, response) => {
                        if (err) return done(err);
                        expect(response.statusCode).to.equal(200);
                        fs.stat(SMALL_IN_DESTINATION, (err) => {
                            expect(!!err).to.equal(true);
                            expect(err.code).to.equal('ENOENT');
                            done();
                        });
                    });
                });
            });

            context('when file does NOT exists', () => {
                it('returns 404 & file does not exists', done => {
                    request.delete(URL_SMALL, (err, response) => {
                        if (err) return done(err);
                        expect(response.statusCode).to.equal(404);
                        fs.stat(SMALL_IN_DESTINATION, (err) => {
                            expect(!!err).to.equal(true);
                            expect(err.code).to.equal('ENOENT');
                            done();
                        });
                    });
                });
            });
        });
    });
});
