// слишком простой чат, в коде есть минимум 7 серьёзных ошибок - КАКИХ?

var http = require('http');
var fs = require('fs');

var clients = [];

http.createServer(function(req, res) {

  switch (req.method + ' ' + req.url) {
  case 'GET /':
    fs.createReadStream('index.html').pipe(res);
    // 1. on readable error
    // 2. on res close
    // mime-type
    break;

  case 'GET /subscribe':
    // add cache-control (недочет)
    console.log("subscribe");
    // 3. try .. catch
    clients.push(res);
    break;

  case 'POST /publish':
    var body = '';
    // 4. on req close
    req
      .on('data', function(data) {
        // 5. check data size
        body += data;
      })
      .on('end', function() {
        // 6. try .. catch
        body = JSON.parse(body);

        console.log("publish '%s'", body.message);

        clients.forEach(function(res) {
          res.end(body.message);
        });

        clients = [];

        res.end("ok");
        // 7. on res close
      });

    break;

  default:
    res.statusCode = 404;
    res.end("Not found");
  }


}).listen(3000);
