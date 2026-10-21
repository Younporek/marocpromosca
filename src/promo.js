'use strict';
const get = require('lodash/get');

// VULNERABILITE VOLONTAIRE POUR UN LABORATOIRE ISOLE.
// Ne jamais employer ce code avec de veritables saisies utilisateur.
function readPromotionPercent(raw) {
  return eval(raw);
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
