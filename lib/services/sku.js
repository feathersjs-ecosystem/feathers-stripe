const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.skus.list(filtered.query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.del(id, stripe);
  }
};
