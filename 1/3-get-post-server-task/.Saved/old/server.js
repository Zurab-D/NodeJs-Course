/**
 ЗАДАЧА
 Написать HTTP-сервер для загрузки и получения файлов
 + Все файлы находятся в директории files
 + Структура файлов НЕ вложенная, поддиректорий нет

 Виды запросов к серверу:
   GET /file.ext
   + выдаёт файл file.ext из директории files,
   + ошибку 404 если файла нет

   POST /file.ext
   + пишет всё тело запроса в файл files/file.ext и выдаёт ОК
   + если файл уже есть, то выдаёт ошибку 409
   +- при превышении файлом размера 1MB  выдаёт ошибку 413

   DELETE /file
   + удаляет файл
   + выводит 200 OK
   + если файла нет, то ошибка 404

 + Вместо file может быть любое имя файла

 + Поддержка вложенных директорий в этой задаче не нужна,
   т.е. при наличии / или .. внутри пути сервер должен выдавать ошибку 400
*/

'use strict';

// подключаем библиотеки
const parse = require('url').parse;
const fs    = require('fs');
const http  = require('http');
const path  = require('path');

//каталог файлов
const FILES_DIR = 'files/';
//максимальный размер загружаемого на сервер файла = 1MB
const FILE_SIZE_LIMIT = 1048576;


/////////////
// Поехали !
/////////////

// создаем сервер
const server = new http.Server((req, res) => {
  const pathname = path.normalize(decodeURI(parse(req.url).pathname));
  const file = path.parse(pathname).base;

  console.log('\nmethod=' + req.method);
  //console.log('req.url=' + req.url);
  //console.log('pathname=' + pathname);
  console.log('file=' + file);

  // проверка присланного клиентом пути - если путь кривой - выходим
  if (file.includes('/') || file.includes('..')) {
    res.statusCode = 400;
    res.end("Bad Request");
    console.log('Bad Request');
    return;
  }

  // в зависимости от метода клиента, вызываем соотв. проц. обработки
  switch(req.method) {
    case 'GET':
      if (pathname === '\\' && !file) {
        fs.readFile(__dirname + '/public/index.html', (err, content) => {
          if (err) throw err;
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.end(content);
        });
        return;
      } else if (file) {
        const rStream = fs.createReadStream(FILES_DIR + file);
        rStream
          .on('error', (err) => {
            rStream.destroy();
            /*
???           этот destroy() здесь к месту?
            */
            if (err.code == 'ENOENT') {
              res.statusCode = 404;
              res.end("file not found");
              console.log('GET: file not found ('+ FILES_DIR + file +')');
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
      let size = 0;
      const wStream = fs.createWriteStream(FILES_DIR + file, {flags: 'wx+'});
      wStream
        .on('error', (err) => {
          //wStream.destroy();
          /*
???         wStream.destroy() вызываю ниже в req.on('error') но правильно ли это?
          */
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
        .on('finish', () => {
          res.end('OK');
          console.log('POST: wStream finished');}
          /*
???         Правильно ли то, что res.end() вызывается тут, а не ниже в req.on('end') ?
          */
        );

      req
        .on('error', (err) => {
          wStream.destroy();
          res.statusCode = 400;
          res.end('Error: ' + err.message);
          console.log('POST: Error: ' + err.message);
        })
        .on('end', () => {
          //res.end('OK');
          //console.log('POST: req.end');
        })
        .on('data', chunk => {
          size += chunk.length;
          if (size > FILE_SIZE_LIMIT) {
            //res.setHeader('Connection', 'close');
            //req.destroy();
            /*
???           - если раскоментировать одну из строки выше, то на клиенте не выскакивает 413
              - если оставляем как есть, входной поток работает, пока не кончится файл, хотя и не пишется в файл...
              как тут правильно сделать?
            */
            res.statusCode = 413;
            res.end('file too large');
            wStream.destroy();
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

/* ???

  1. Когда срабатывает событие close, которое есть и в ReadStream и в WriteStream?
  2. Когда вызывать destroy() и на каких потоках? Например если один поток читает
     и тут же пайпит в другой, то на котором из потоков нужно вызывать destroy()?

*/
