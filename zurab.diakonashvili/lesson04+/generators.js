'use strict';

function* infinity() {
  let i = 0;
  while(true) {
    yield ++i;
  }
}

const gen = infinity();

for (let num of infinity()) {
  console.log(num);
}
