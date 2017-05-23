'use strict';

const server = require('..');
const request = require('co-request');
const { expect } = require('chai');

require('co-mocha');

var User = require('../libs/user');

function getURL(path){
    return `http://localhost:3000/api${path}`;
};

describe('User REST API', function(){
  const existingUserData = {
      email: 'john@test.ru'
  };
  const newUserData = {
      email: 'alice@test.ru'
  };
	let existingUser;

  beforeEach(function* (){
      // load fixtures
      yield User.remove({});
      existingUser = yield User.create(existingUserData);
  });

  describe('POST /users', function() {
    it('creates a user', function* (){
        const response = yield request({
            method: 'post',
            url: getURL('/users'),
            json: true,
            body: newUserData
        });

        expect(response.body).to.have.property('email');
    });

    it('throws if email already exists', function*() {
        const response = yield request({
            method: 'post',
            url: getURL('/users'),
            json: true,
            body: existingUserData
        });

        expect(response.statusCode).to.equal(400);
    });

	  it('throws if email not valid', function*() {
        const response = yield request({
            method: 'post',
            url: getURL('/users'),
            json: true,
            body: {email: 'invalid'}
        });

        expect(response.statusCode).to.equal(400);
    });
  });

	describe('GET /user/:userById', function() {
    it('gets the user by id', function* (){
      const response = yield request.get(
        getURL(`/users/${existingUser._id}`)
      );
      expect(JSON.parse(response.body)).to.have.property('email');
			expect(response.statusCode).to.equal(200);
    });

    it('returns 404 if user does not exist', function*() {
        const response = yield request.get(
          getURL('/users/55b693486e02c26010ef0000')
        );

        expect(response.statusCode).to.equal(404);
    });

    it('returns 404 if invalid id', function*() {
			const response = yield request.get(
        getURL('/users/kkkkk')
      );

      expect(response.statusCode).to.equal(404);
    });
  });

	describe('DELETE /user/:userById', function() {
    it('removes user', function* (){
      const response = yield request.del(
        getURL('/users/' + existingUser._id)
      );

      expect(response.statusCode).to.equal(200);

      const users = yield User.find({});

			expect(users.length).to.equal(0);
    });

    it('returns 404 if the user does not exist', function*() {
        const response = yield request.del(
          getURL('/users/55b693486e02c26010ef0000')
        );

        expect(response.statusCode).to.equal(404);
    });
  });

	it('GET /users gets all users', function* (){
		 const response = yield request.get(
       getURL('/users')
     );

     expect(response.statusCode).to.equal(200);

     expect(response.headers)
       .to.have.property('content-type')
       .and.to.match(/application\/json/);
  });
});
