// слишком простой чат, в коде есть минимум 7 серьёзных ошибок - КАКИХ?

var http = require('http');
var fs = require('fs');

var clients = [];

http.createServer(function(req, res) {

  switch (req.method + ' ' + req.url) {
  case 'GET /':
    fs.createReadStream('index.html').pipe(res);
    // 1 не обрабатываем error
    // 2 req.on('close') ? stream.destroy
    // mime-type
    break;

  case 'GET /subscribe':
    // add cache-control (недочет)
    console.log("subscribe");
    // 3 нет обработки 'close', пользователь остаётся в массиве
    clients.push(res);
    break;

  case 'POST /publish':
    var body = '';
    // 4 default encoding
    req
      .on('data', function(data) {
        // 5 слишком большой запрос
        body += data;
      })
      .on('end', function() {
        // 6 try catch
        body = JSON.parse(body);

        console.log("publish '%s'", body.message);

        clients.forEach(function(res) {
          // 7. body имеет message, и этот message - строка
          res.end(body.message);
        });

        clients = [];

        res.end("ok");
      });

    break;

  default:
    res.statusCode = 404;
    res.end("Not found");
  }


}).listen(3000);
