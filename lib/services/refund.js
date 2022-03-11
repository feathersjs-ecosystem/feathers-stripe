const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.refunds.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.refunds.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.refunds.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.refunds.update(id, data, stripe);
  }
};
