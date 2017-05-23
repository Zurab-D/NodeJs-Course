// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
const jade = require('jade');
const config = require('config');
const path = require('path');

module.exports = function* (next) {

  let ctx = this;

  /* default helpers */
  this.locals = {
    /* at the time of this middleware, user is unknown, so we make it a getter */
    get user() {
      return ctx.req.user; // passport sets this
    }
  };

  this.render = (templatePath, locals) => {
    locals = locals || {};
    // warning!
    // _.assign does NOT copy defineProperty
    // so I use this.locals as a root and merge all props in it, instead of cloning this.locals
    const localsFull = Object.create(this.locals);

    for(let key in locals) {
      localsFull[key] = locals[key];
    }

    const templatePathResolved = path.join(config.template.root, templatePath + '.jade');

    return jade.renderFile(templatePathResolved, localsFull);
  };

  yield* next;

};
