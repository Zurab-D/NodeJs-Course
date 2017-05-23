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

const parse = require('url').parse;
const fs = require('fs');
const http = require('http');
const path = require('path');
const FILES_DIR = 'files/';
let file;
let rstream;

const server = new http.Server((req, res) => {
  const parsed = parse(req.url, true);
  const pathname = path.normalize(decodeURI(parsed.pathname));
//console.log(parsed);
console.log('method=' + req.method);
console.log('pathname=' + pathname);

  switch(req.method) {
    case 'GET':
      file = parsed.query.file || '';
//console.log('file="' + file + '"');
//console.log('1');
      if (pathname === '\\' && !file) {
//console.log('zzz');
        // rewrite with streams and error handling (!)
        fs.readFile(__dirname + '/public/index.html', (err, content) => {
          if (err) throw err;
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.end(content);
        });
        return;
      } else if (pathname === '\\' && file) {
//console.log('2');
        rstream = fs.createReadStream(FILES_DIR + file);
        rstream
          .on('error', (err) => {
            rstream.destroy();
            console.log('Error: ' + err.message);
            res.end('Error: ' + err.message);
          })
          .pipe(res);
      } else {
console.log('чо за хня??');
        res.end('чо за хня??');
      }
      break;
    case 'POST':
      file = path.parse(pathname).base;
//console.log('file to save=' + file);
      const wstream = fs.createWriteStream(FILES_DIR + file);
      wstream
          .on('error', (err) => {
            wstream.destroy();
            console.log('Error: ' + err.message);
            res.end('Error: ' + err.message);
          });
      /*
???     wstream.pipe(); - в таком варианте файл на сервер сохраняется(???), но при этом срабатывает событие 'error'
      */
      req.pipe(wstream);
      res.end('post end');
      /*
???     если res.end() НЕ вызвать, то файл на сервер сохраняется, но на клиенте не случается xhr.onload
      */
      break;
    case 'DELETE':
      file = path.parse(pathname).base;
console.log('file to delete=' + file);
      fs.stat(FILES_DIR + file, (err, stats) => {
        if (err) {
console.log('fs.stat :: error : ' + err.message);
          //res.end(err.message);
        } else {
          if (stats.isFile()) {
            //fs.unlink(FILES_DIR + file, (err) => console.dir(arguments));
            fs.unlink(FILES_DIR + file, (err) => {
console.dir(arguments);
              if (err) {
console.log('Error on delete file: ' + err.message);
                //res.end('Error on delete file: ' + err.message);
              } else {
console.log('file deleted');
                res.end('file deleted');
              };
            });
          } else {
console.log('file not found');
            //res.end('file not found');
          };
        }
      });
      break;
    default:
      res.statusCode = 502;
      res.end('Not implemented');
      break;
  }
}).listen(3000);
