const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.coupons.list(filtered.query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.coupons.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.coupons.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.coupons.update(id, data, stripe);
  }
};
