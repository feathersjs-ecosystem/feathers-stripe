const Base = require('./base');
const { normalizeParams } = require('../normalize');

module.exports = class Service extends Base {
  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.accountLinks.create(data, stripe);
  }
};
