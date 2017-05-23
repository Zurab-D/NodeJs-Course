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

    // �������� ����������� �������� ���� - ���� ���� ������ - �������
    if (checkFileName(fileName)) {
        switch(req.method) {
            case 'GET':
                // ������ ������� ������
                handlerGet(fileName, res);
                break;

            case 'POST':
                // ������ ��������� ���� �� ������
                handlerPost(fileName, req, res);
                break;

            case 'DELETE':
                // ������ ������ ������� ����
                handlerDelete(fileName, res);
                break;

            default:
                // ���������� ����� �������
                res.statusCode = 501;
                res.end('Not implemented');
                break;
          }
    }
};
