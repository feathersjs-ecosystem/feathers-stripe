const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.balanceTransactions.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.balanceTransactions.retrieve(id, stripe);
  }
};
