exports.get = function*(next) {
  //console.log(this.isAuthenticated(), this.user);

  if (this.isAuthenticated()) {
    this.body = this.render('welcome');
  } else {
    this.body = this.render('login');
  }

};

