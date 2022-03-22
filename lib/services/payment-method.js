const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.paymentMethods.list(filtered.query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.create(data, stripe);
  }

  _patch (id, data, params) {
    const { stripe } = this.filterParams(params);
    const { attach, ...rest } = data;
    if (attach) {
      return this.stripe.paymentMethods.attach(id, rest, stripe);
    }
    return this._update(id, data, params);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.detach(id, stripe);
  }
};
