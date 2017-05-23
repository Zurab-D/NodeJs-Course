exports.get = function*(next) {
  if (this.isAuthenticated()) {
    this.body = this.render('welcome');
  } else {
console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    this.body = this.render('login');
  }
};
