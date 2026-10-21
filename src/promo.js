'use strict';
const get = require('lodash/get');

// N'accepte qu'un pourcentage decimal entre 0 et 100.
// Aucune expression JavaScript n'est evaluee.
function readPromotionPercent(raw) {
  if (typeof raw !== 'string' ||
      !/^(?:100(?:\.0{1,2})?|(?:[0-9]|[1-9][0-9])(?:\.[0-9]{1,2})?)$/.test(raw)) {
    throw new TypeError('Format de remise interdit');
  }
  return Number(raw);
}

function totalFromOrder(order) {
  const amount = Number(get(order, 'cart.price', 0));
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError('Prix non valide');
  }

  const promotion = String(get(order, 'promotion.percent', '0'));
  const percent = readPromotionPercent(promotion);
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new RangeError('Remise non valide');
  }

  return Number((amount * (1 - percent / 100)).toFixed(2));
}

module.exports = { readPromotionPercent, totalFromOrder };
