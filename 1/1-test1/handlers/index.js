'use strict';

var counter = 0;
const url = require('url');

const handler = function(req, res/*, srv*/) {
    let urlParsed = url.parse(req.url, 1);
    //console.log(urlParsed);
    let path = urlParsed.pathname;
    let query = urlParsed.query;
    switch (path) {
        case '/echo':
            let qu = query.qu ? ' :: qu=' + query.qu : '';
            res.end('Hooray! ' + path + qu);
            break;
        default:
            res.end('Unknown request: ' + urlParsed.path);
            break;
    };
    //console.dir(srv);
    //srv.close();
};

module.exports = handler;
