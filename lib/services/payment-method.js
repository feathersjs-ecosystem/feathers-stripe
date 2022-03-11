const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.paymentMethods.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.paymentMethods.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.paymentMethods.create(data, stripe);
  }

  _patch (id, data, params) {
    const { stripe } = normalizeParams(params);
    const { attach, ...rest } = data;
    if (attach) {
      return this.stripe.paymentMethods.attach(id, rest, stripe);
    }
    return this._update(id, data, params);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.paymentMethods.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.paymentMethods.detach(id, stripe);
  }
};
