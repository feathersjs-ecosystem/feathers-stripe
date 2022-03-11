const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.skus.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.skus.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.skus.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.skus.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.skus.del(id, stripe);
  }
};
