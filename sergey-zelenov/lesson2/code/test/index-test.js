'use strict';

const sum = require('./index');

describe('sum function', () => {
  describe('throw', () => {
    it('should throw exception', () => {
      // sum.bind(this, [], {})
      expect(() => sum([], '')).to.throw(/values must be numbers/);
    });
  });

  describe('return value', () => {
    it('should return sum of 1 and 2', () => {
      expect(sum(1, 2)).to.equal(3);
    });

    it('should return sum of 2 and 2', () => {
      expect(sum(2, 2)).to.equal(4);
    });
  });
});
