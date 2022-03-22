const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.paymentIntents.list(filtered.query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentIntents.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentIntents.create(data, stripe);
  }

  _patch (id, data, params) {
    const { stripe } = this.filterParams(params);
    if (data.capture) {
      return this.stripe.paymentIntents.capture(id, stripe);
    }
    return this._update(id, data, params);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentIntents.update(id, data, stripe);
  }
};
