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
const mime  = require('mime');

//каталог файлов
const FILES_DIR = __dirname + '/files/';
//максимальный размер загружаемого на сервер файла = 1MB
const FILE_SIZE_LIMIT = 1048576;



// Создаем сервер
const server = new http.Server((req, res) => {
  const pathname = path.normalize(decodeURI(parse(req.url).pathname));
  let fileName = path.parse(pathname).base;

  console.log('\nmethod=' + req.method);
  //console.log('req.url=' + req.url);
  //console.log('pathname=' + pathname);
  console.log('fileName=' + fileName);

  // проверка присланного клиентом пути - если путь кривой - выходим
  if (checkFileName(fileName)) {
    switch(req.method) {
      case 'GET':
        // Клиент прислал запрос
        processGet(fileName, res);
        break;
      case 'POST':
        // Клиент загружает файл на сервер
        processPost(fileName, req, res);
        break;

      case 'DELETE':
        // Клиент просит удалить файл
        processDelete(fileName, res);
        break;

      default:
        // Шаловливые ручки клиента
        res.statusCode = 501;
        res.end('Not implemented');
        break;
    }
  }
});



/*** Проверка присланного клиентом пути - если путь кривой - выходим */
function checkFileName(fileName) {
  if (fileName.includes('/') || fileName.includes('..')) {
    res.statusCode = 400;
    res.end("Bad Request");
    console.log('Bad Request');
    return false;
  };
  return true;
}



/*** Обработка GET запросов */
function processGet(fileName, res) {
  //if (pathname === '\\' && !fileName) {
  if (!fileName || fileName.toLowerCase() === 'index.html') {
    /*** Покажем HTML */
    fileName = __dirname + '/public/index.html';
  } else if (fileName) {
    /*** Отдадим файл клиенту */
    fileName = FILES_DIR + fileName;
  }

  const stream = fs.createReadStream(fileName);
  stream
    .on('open', () => {
      res.setHeader('Content-Type', mime.lookup(fileName));
    })
    .on('error', (err) => {
      if (err.code == 'ENOENT' || err.code == 'EISDIR') {
        res.statusCode = 404;
        res.end("fileName not found");
        console.log('GET: file not found ('+ FILES_DIR + fileName +')');
      } else {
        res.statusCode = 500;
        res.end('Error: ' + err.message);
        console.log('POST: Error: ' + err.message);
      }
    })
    .on('end', () => {console.log('GET: successfully ended');})
    .pipe(res);

  res.on('close', (err) => {
    stream.destroy();
    console.log('GET: close: ' + err.message);
  })
}



/*** Обработка POST запросов */
function processPost(fileName, req, res) {
  let size = 0;
  const wStream = fs.createWriteStream(FILES_DIR + fileName, {flags: 'wx+'});
  wStream
    .on('error', (err) => {
      //wStream.destroy();
      /*
???         wStream.destroy() вызываю ниже в req.on('error') но правильно ли это?
      */
      if (err.code == 'EEXIST') {
        res.statusCode = 409;
        res.end('Error: ' + err.message);
        console.log('POST: fileName allredy exists');
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
???       - если раскоментировать одну из строки выше, то на клиенте не выскакивает 413
          - если оставляем как есть, входной поток работает, пока не кончится файл, хотя и не пишется в файл...
          как тут правильно сделать?
        */
        res.statusCode = 413;
        res.end('fileName too large');
        wStream.destroy();
        fs.unlink(FILES_DIR + fileName, (err) => {
          if (err) {
            console.log('POST: error on fs.unlink: ' + err.message);
          }
        });
        console.log('POST: fileName too large');
      }
    })
    .pipe(wStream);
}



/*** Обработка запроса на удаление (DELETE) */
function processDelete(fileName, res) {
  fs.unlink(FILES_DIR + fileName, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end("Not found");
        console.log('DELETE: fileName not found');
      } else {
        res.statusCode = 500;
        console.log('DELETE: Error: ' + err.message);
        //res.end('Error on delete fileName: ' + err.message); <---- надо? не надо? хз..
      }
    } else {
      console.log('DELETE: fileName successfully deleted');
      res.end('OK');
    };
  });
}



module.exports = server;



/* ???

  1. Когда срабатывает событие close, которое есть и в ReadStream и в WriteStream?
  2. Когда вызывать destroy() и на каких потоках? Например если один поток читает
     и тут же пайпит в другой, то на котором из потоков нужно вызывать destroy()?

*/
