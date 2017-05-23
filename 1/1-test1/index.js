'use strict';

const http = require('http').Server;
const handler = require('handlers');

const srv = new http((req, res) => {
    handler(req, res)
}).listen(3000);

setTimeout(()=>{
    console.log('clode');
    srv.close();
}, 2000);
