'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { readPromotionPercent, totalFromOrder } = require('../src/promo');

test('remise de 15 % sur 200 DH = 170 DH', () => {
  assert.equal(totalFromOrder({ cart: { price: 200 }, promotion: { percent: '15' } }), 170);
});

test('sans promotion, le prix ne change pas', () => {
  assert.equal(totalFromOrder({ cart: { price: 99.9 } }), 99.9);
});

test('remise de 12,5 % sur 80 DH = 70 DH', () => {
  assert.equal(totalFromOrder({ cart: { price: 80 }, promotion: { percent: '12.5' } }), 70);
});

test('un prix negatif est refuse', () => {
  assert.throws(() => totalFromOrder({ cart: { price: -1 } }), RangeError);
});

test('le pourcentage simple est lu correctement', () => {
  assert.equal(readPromotionPercent('10'), 10);
});
