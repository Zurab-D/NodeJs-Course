/*
  Class represents an animal
  @param {string} name - the name of the animal
*/
module.exports = class Animal {
  constructor(name) {
    this.legs = 4;
    this.name = name;
  }

  sayHi() {
    console.log(`hi, I'm ${this.name}`);
  }
};
