const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = this.filterParams(params);
    return this.stripe.charges.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.charges.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.charges.create(data, stripe);
  }

  _patch (id, data, params) {
    const { stripe } = this.filterParams(params);
    const { capture, ...rest } = data;
    if (capture) {
      return this.stripe.charges.capture(id, rest, stripe);
    }
    return this._update(id, data, params);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.charges.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.refunds.create({ charge: id }, stripe);
  }
};
