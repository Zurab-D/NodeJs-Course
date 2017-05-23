module.exports = function sum(a, b) {
  if ([a, b].some(num => typeof num !== 'number'))
    throw new Error('values must be numbers');

  return a + b;
};
