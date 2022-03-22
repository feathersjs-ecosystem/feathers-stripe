const Base = require('./base');

module.exports = class Service extends Base {
  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.accountLinks.create(data, stripe);
  }
};
