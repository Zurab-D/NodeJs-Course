module.exports = function* flash(next) {
  this.flash = this.session.flash || {};

  this.session.flash = {};

  Object.defineProperty(this, 'newFlash', {
    get: () => {
      return this.session.flash;
    },
    set: val => {
      this.session.flash = val;
    }
  });

  yield *next;

  // now this.session can be null
  // (logout does that)

  if (this.session && Object.keys(this.session.flash).length === 0) {
    // don't write empty flash
    delete this.session.flash;
  }

  if (this.status === 302 && this.session && !this.session.flash) {
    // pass on the flash over a redirect
    this.session.flash = this.flash;
  }
};
