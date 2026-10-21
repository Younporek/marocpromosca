'use strict';
// BONUS : copier ce test dans tests/ apres avoir corrige src/promo.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const { readPromotionPercent } = require('../src/promo');

test('une expression JavaScript est refusee', () => {
  assert.throws(() => readPromotionPercent('1 + 2'), TypeError);
});
