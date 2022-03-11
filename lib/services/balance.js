const Base = require('./base');
const { normalizeParams } = require('../normalize');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.balance.retrieve(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.balance.retrieve({ stripe_account: id }, stripe);
  }
};
