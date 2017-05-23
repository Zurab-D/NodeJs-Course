const path = require('path');
const jade = require('jade');
const config = require('config');

const defaultLocals = config.get('jade');

module.exports = function* (next) {

  this.render = (templatePath, locals) => {
    const options = Object.assign({}, defaultLocals, locals);

    Object.defineProperty(options, 'user', {
      get: () => {
        return this.req.user;
      }
    });

    Object.defineProperty(options, 'authorised', {
      get: () => {
        return !!this.req.user;
      }
    });

    Object.defineProperty(options, 'flash', {
      get: () => {
        return this.flash;
      }
    });

    const template = path.join(config.get('root'), 'handlers', `${templatePath}.jade`);

    return jade.renderFile(template, options);
  };

  yield* next;

};
