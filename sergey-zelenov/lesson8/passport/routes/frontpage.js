exports.get = function*(next) {
  if (this.isAuthenticated()) {
    this.body = this.render('welcome');
  } else {
    this.body = this.render('login');
  }
};
