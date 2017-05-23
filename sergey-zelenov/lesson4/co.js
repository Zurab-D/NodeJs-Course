'use strict';

const User = {
  find() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('ERROR!');
      }, 2000);
    });
  }
}

function* doSomethingAsync(name) {
  try {
    const user = yield User.find({name});
  } catch (error) {
    console.log(error);
  }
  // user
  console.log(user);
  return user;
}

// thunk
// fs.readFile((err, content) => {})

function execute(generator, value) {
  let next = generator.next(value);

  if (!next.done) {
    next.value.then(
      res => execute(generator, res),
      err => generator.throw(err)
    )
  } else {
    console.log('finished', next.value);
  }
}

co(doSomethingAsync('Vasya'));
