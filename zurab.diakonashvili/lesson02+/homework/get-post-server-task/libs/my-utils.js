'use strict';

/*** �������� ����������� �������� ���� - ���� ���� ������ - ������� */
module.exports = {
    checkFileName : fileName => {
        if (fileName.includes('/') || fileName.includes('..')) {
            res.statusCode = 400;
            res.end("Bad Request");
            return false;
        };
        return true;
    },
    limitFileSize : require(rootDir + '/config').get('limitFileSize'),
};
