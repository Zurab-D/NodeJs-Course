'use strict';

const koa = require('koa');
const app = koa();
const compose = require('koa-compose');
const Router = require('koa-router');
const router = new Router();

const User = require('./User');

const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/test', {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});



app.use(function*(next) {
    console.log(`----->> req.url = "${this.req.url}"`);
    yield* next;
});


app.use(compose([
    require('koa-favicon')(),
    require('koa-static')('public'),
    require('koa-logger')(),
    require('koa-views')('./templates'),
    require('./middlewares/errors'),
    require('koa-generic-session')(),
    require('koa-bodyparser')(),
    require('./middlewares/multipartParser')
]));


/* ????????????????? �� �����. �� �������� ????????????????? */
/*app.use(function*(next) {
    console.log('----->> wait for connection ...');
    yield new Promise(resolve => {
        mongoose.connection.on('connected', resolve);
    });
    console.log('----->> ... connected');

    yield* next;
});*/


router.get('/users', function*() {
    console.log('----->> router.get(/users)');
    try {
        this.body = yield User.find({}); // .exec() - legacy .lean() - toJSON
        this.status = 200;
    } catch(e) {
        this.status = 500;
        console.log(e);
    }
});


router.get('/users/:id', function*() {
    console.log('----->> router.get(/users/:'+this.params.id+')');
    try {
        this.body = yield User.find({"email":this.params.id}).exec();
        this.status = 200;
    } catch(e) {
        this.status = 500;
        console.log(e);
    }
});


router.post('/users', function*() {
    console.log('----->> router.POST(/users)');
    const { email } = this.request.body;
    console.log('----->> email='+email);
    const newUser = new User({
        email: email
    });
    try {
        yield newUser.save(); //.catch(err => err);
        this.status = 200;
        this.body = '�';
    } catch(e) {
        this.status = 500;
        console.log(e);
    }
});


router.delete('/users/:id', function*() {
    console.log('----->> router.DELETE(/users/:'+this.params.id+')');
    try {
        yield User.remove({"email":this.params.id});
        this.status = 200;
        this.body = ''
    } catch(e) {
        this.status = 500;
        console.log(e);
    }
});
// [[ ??? ]] <<----------------- � ��� ������� �������� ��������� ��������/�������� ������?


app.use(router.routes());
app.listen(3000, 'localhost', () => {console.log('http://localhost:3000')});
