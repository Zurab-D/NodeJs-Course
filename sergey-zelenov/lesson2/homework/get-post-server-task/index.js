/**
 ЗАДАЧА
 Написать HTTP-сервер для загрузки и получения файлов
 - Все файлы находятся в директории files
 - Структура файлов НЕ вложенная, поддиректорий нет

 - Виды запросов к серверу
   GET /file.ext
   - выдаёт файл file.ext из директории files,
   - ошибку 404 если файла нет

   POST /file.ext
   - пишет всё тело запроса в файл files/file.ext и выдаёт ОК
   - если файл уже есть, то выдаёт ошибку 409
   - при превышении файлом размера 1MB  выдаёт ошибку 413

   DELETE /file
   - удаляет файл
   - выводит 200 OK
   - если файла нет, то ошибка 404

 Вместо file может быть любое имя файла

 Поддержка вложенных директорий в этой задаче не нужна,
 т.е. при наличии / или .. внутри пути сервер должен выдавать ошибку 400
 */

'use strict';

const { parse } = require('url');
const { readFile } = require('fs');
const { Server } = require('http');

const server = new Server((req, res) => {
  const pathname = decodeURI(parse(req.url).pathname);

  switch(req.method) {
    case 'GET':
      if (pathname == '/') {
        // rewrite with streams and error handling (!)
        readFile(__dirname + '/public/index.html', (err, content) => {
          if (err) throw err;
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.end(content);
        });
        return;
      }
      break;
    default:
      res.statusCode = 502;
      res.end('Not implemented');
      break;
  }
}).listen(3000);
