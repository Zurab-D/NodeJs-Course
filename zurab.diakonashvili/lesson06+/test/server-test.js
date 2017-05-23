'use strict';

const server = require('../app');
const request = require('co-request');
const { expect } = require('chai');

require('co-mocha');

const config = require('config');

const User = require('../models/user');

function getURL(path){
    return `http://${config.host}:${config.port}${path}`;
};

describe('User REST API', function() {
    const email1 = {email: 'email1@domain1.com1'};
    const email2 = {email: 'email2@domain2.com2'};
    const emails = [email1.email, email2.email];
    const emailPosted = {email: 'email-p@domain-p.com-p'};

    // start server
    before(function*() {
        server.listen(config.port, config.host);
    });

    // after all : clear db
    after(function*() {
        yield User.remove({});
    })

    // before each : clear db
    beforeEach(function*() {
        yield User.remove({});
    })

    describe('get /api/users', function() {
        // before : insert some documents
        beforeEach(function*() {
            yield User.create(email1);
            yield User.create(email2);
        });

        it('returns code == 200 && array with 2 user objects', function*() {
            let responce = yield request.get(getURL('/api/users'));
            let { body } = responce;

            let emailsInBody = body
                    .replace('},{','}@#${')
                    .replace('[','')
                    .replace(']','')
                    .split('@#$')
                    .map(item => {
                        return JSON.parse(item).email
                    });

            expect(responce.statusCode).to.equal(200);
            expect(emailsInBody).to.deep.equal(emails);
        });
    });

    describe('get /api/users/:id', function() {
        let user1;

        // before : insert some documents
        beforeEach(function*() {
            user1 = yield User.create(email1);
        });

        it('returns 200 & email1', function*() {
            let responce = yield request.get(getURL('/api/users/' + user1._id));
            let { body } = responce;

            body = body.replace('[','').replace(']','');
            let emailInBody = JSON.parse(body).email;

            expect(responce.statusCode).to.equal(200);
            expect(emailInBody).to.deep.equal(email1.email);
        });

    });

    describe('post /api/users', function() {
        it('returns 200 & document inserted in db is - emailPosted (const described upper)', function*() {
            let responce = yield request.post({url: getURL('/api/users'), form: {email: emailPosted.email}});
            let userFound = yield User.findOne({email: emailPosted.email});

            expect(responce.statusCode).to.equal(200);
            expect(userFound.email).to.equal(emailPosted.email);
        });
    });

    describe('delete /api/users/:id', function() {
        let user1;

        // before : insert some documents
        beforeEach(function*() {
            user1 = yield User.create(email1);
        });

        it('returns 200 & empty set of docs', function*() {
            let responce = yield request.del(getURL('/api/users/' + user1._id));
            let userFound = yield User.findOne({});

            expect(responce.statusCode).to.equal(200);
            expect(!!userFound).to.equal(false);
        });
    });
});
