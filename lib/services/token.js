const Base = require('./base');
const { normalizeParams } = require('../normalize');

module.exports = class Service extends Base {
  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.tokens.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.tokens.create(data, stripe);
  }
};
