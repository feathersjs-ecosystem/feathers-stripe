const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.payouts.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.payouts.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    const { connect = {}, ...rest } = data;
    return this.stripe.payouts.create(rest, connect, stripe);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.payouts.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.payouts.close(id, stripe);
  }
};
