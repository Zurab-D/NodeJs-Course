'use strict';

const url = require('url');
const path = require('path');

const myUtils = require(path.join(rootDir, 'libs', 'my-utils'));
const checkFileName = myUtils.checkFileName;

const handlerGet = require('./handler-get');
const handlerPost = require('./handler-post');
const handlerDelete = require('./handler-delete');

module.exports = (req, res) => {
    const pathname = decodeURI(url.parse(req.url).pathname);
    const fileName = pathname.slice(1); // /file.ext -> file.ext

    // проверка присланного клиентом пути - если путь кривой - выходим
    if (checkFileName(fileName)) {
        switch(req.method) {
            case 'GET':
                // Клиент прислал запрос
                handlerGet(fileName, res);
                break;

            case 'POST':
                // Клиент загружает файл на сервер
                handlerPost(fileName, req, res);
                break;

            case 'DELETE':
                // Клиент просит удалить файл
                handlerDelete(fileName, res);
                break;

            default:
                // Шаловливые ручки клиента
                res.statusCode = 501;
                res.end('Not implemented');
                break;
          }
    }
};
