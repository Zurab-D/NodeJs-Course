'use strict';

// recieve multipart/form
// without files

// for routes which require custom file handling
// can introduce config to ignore them here

const busboy = require('co-busboy');

module.exports = function* (next) {
  // the body isn't multipart, so busboy can't parse it
  if (!this.request.is('multipart/*')) {
    return yield* next;
  }

  const parser = busboy(this, {
    autoFields: true
  });

  let part;
  while (part = yield parser) {
    // autoFields => part is a file
    // specific handlers know how to handle the file, not us
    // alt: can auto-save to disk
    this.throw(400, 'Files are not allowed here');
  }

  for (let key in parser.fields) {
    this.request.body[key] = parser.fields[key];
  }

  yield* next;
};
