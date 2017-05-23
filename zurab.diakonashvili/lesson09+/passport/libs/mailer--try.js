'use strict';

require('./mailer')({
  from: "vasja@pupkind.fly",
  subject: "testO !!!!!",
  text: "test\ntest\ntest\ntest\ntest\n",
  html: ""
})
  .then(response => console.log('Message sent: ' + response))
  .catch(error => console.error(error));
