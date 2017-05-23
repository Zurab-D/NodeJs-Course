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
let rstream;

const server = new http.Server((req, res) => {
  const parsed = parse(req.url, true);
  const pathname = path.normalize(decodeURI(parsed.pathname));
  const file = path.parse(pathname).base;

//console.log(parsed);
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
        rstream = fs.createReadStream(FILES_DIR + file);
        rstream
          .on('error', (err) => {
            rstream.destroy();
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
      const wstream = fs.createWriteStream(FILES_DIR + file, {flags: 'wx+'});
      wstream
        .on('error', (err) => {
          wstream.destroy();
          if (err.code == 'EEXIST') {
            res.statusCode = 409;
            res.end('Error: ' + err.message);
            console.log('POST: file allredy exists');
          } else {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
            console.log('POST: Error: ' + err.message);
          }
        });
        /*
???       wstream.pipe(); - в таком варианте файл на сервер сохраняется(???), но при этом срабатывает событие 'error'
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
        .pipe(wstream);
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
}).listen(3000);
