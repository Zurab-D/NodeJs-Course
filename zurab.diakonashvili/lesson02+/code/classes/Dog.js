'use strict';

const Animal = require('./Animal');

/*
  Class represeting a dog
  @extends Animal
*/
class Dog extends Animal {
  jump() {
    console.log(`I can jump ${this.name}`);
  }
}

const dog = new Dog('Layka');

dog.sayHi();
dog.jump();
