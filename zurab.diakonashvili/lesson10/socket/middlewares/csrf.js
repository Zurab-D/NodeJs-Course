'use strict';

module.exports = function* (next) {
    try {
        this.assertCSRF(this.request.body);
    } catch (err) {
        this.status = 403;
        this.body = {
            message: 'This CSRF token is invalid!'
        };
        return;
    };

    yield next;
};
