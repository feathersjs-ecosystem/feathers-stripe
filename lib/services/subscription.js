const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.subscriptions.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.subscriptions.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.subscriptions.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.subscriptions.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.subscriptions.del(id, stripe);
  }
};
