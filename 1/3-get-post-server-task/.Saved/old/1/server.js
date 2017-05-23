/**
 ЗАДАЧА
 Написать HTTP-сервер для загрузки и получения файлов
 + Все файлы находятся в директории files
 + Структура файлов НЕ вложенная, поддиректорий нет

 - Виды запросов к серверу
   GET /file.ext
   +- выдаёт файл file.ext из директории files,
   + ошибку 404 если файла нет

   POST /file.ext
   + пишет всё тело запроса в файл files/file.ext и выдаёт ОК
   + если файл уже есть, то выдаёт ошибку 409
   - при превышении файлом размера 1MB  выдаёт ошибку 413

   DELETE /file
   + удаляет файл
   + выводит 200 OK
   + если файла нет, то ошибка 404

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
const FILE_SIZE_LIMIT = 1048576; //1014 * 1024 = 1MB

let size = 0;

const server = new http.Server((req, res) => {
const parsed = parse(req.url, true);
const pathname = path.normalize(decodeURI(parsed.pathname));
const file = path.parse(pathname).base;

console.log('\nmethod=' + req.method);
console.log('pathname=' + pathname);

  switch(req.method) {
    case 'GET':
      //console.log('file=' + file);
      if (pathname === '\\' && !file) {
        fs.readFile(__dirname + '/public/index.html', (err, content) => {
          if (err) throw err;
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.end(content);
        });
        return;
      } else if (file) {
        const rStream = fs.createReadStream(FILES_DIR + file);
rStream.emit0 = rStream.emit;
rStream.emit = function() {
  console.log(arguments[0]);
  return this.emit0.apply(this, arguments);
};
        rStream
          .on('error', (err) => {
            rStream.destroy();
            if (err.code == 'ENOENT') {
              res.statusCode = 404;
              res.end("file not found");
              console.log('GET: file not found');
            } else {
              res.statusCode = 500;
              res.end('Error: ' + err.message);
              console.log('POST: Error: ' + err.message);
            }
          })
          .on('end', () => {console.log('GET: successfully ended');})
          .pipe(res);
      } else {
        console.log('wtf?');
        res.end('wtf?');
      }
      break;
    case 'POST':
      const wStream = fs.createWriteStream(FILES_DIR + file, {flags: 'wx+'});

const emit = wStream.emit;
wStream.emit = function() {
  console.log(arguments[0]);
  return emit.apply(this, arguments);
};
/*wStream.write('qwerty');
wStream.write('йцукенг');
wStream.end('');
break;*/

      wStream
        .on('error', (err) => {
          wStream.destroy();
          if (err.code == 'EEXIST') {
            res.statusCode = 409;
            res.end('Error: ' + err.message);
            console.log('POST: file allredy exists');
          } else {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
            console.log('POST: Error: ' + err.message);
          }
        })

        ;
        /*
???       wStream.pipe(); - в таком варианте файл на сервер сохраняется(?), но при этом срабатывает событие 'error'
        */
      req
        .on('error', (err) => {
          res.statusCode = 400;
          res.end('Error: ' + err.message);
          console.log('POST: Error: ' + err.message);
        })
        .on('end', () => {
          console.log('POST: successfully ended');
          res.end('OK');
        })
        .on('data', chunk => {
          size += chunk.length;
          if (size > FILE_SIZE_LIMIT) {
            wStream.destroy();
            //req.destroy();
            //res.setHeader('Connection', 'close');
            /*
???           если раскоментировать одну из строки выше, то на клиенте не выскакивает 413
              если оставляем как есть, входной поток работает, пока не кончится файл, хотя и не пишется...
              как тут правильно сделать?
            */
            res.statusCode = 413;
            res.end('file too large');
            fs.unlink(FILES_DIR + file, (err) => {
              if (err) {
                console.log('POST: err: ' + err.message);
              } else {
                //console.log(arguments);
              }
            });
            console.log('POST: file too large');
          }
        })
        .pipe(wStream);
      break;
    case 'DELETE':
      fs.unlink(FILES_DIR + file, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end("Not found");
            console.log('DELETE: file not found');
          } else {
            res.statusCode = 500;
            console.log('DELETE: Error: ' + err.message);
            //res.end('Error on delete file: ' + err.message);
          }
        } else {
          console.log('DELETE: file successfully deleted');
          res.end('OK');
        };
      });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
      break;
  }
});

module.exports = server;

/*
??? Когда срабатывает событие close, которое есть и в ReadStream и в WriteStream
*/