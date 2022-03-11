const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.prices.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.prices.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.prices.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.prices.update(id, data, stripe);
  }
};
