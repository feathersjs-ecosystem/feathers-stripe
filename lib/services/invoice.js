const { normalizeParams } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    return this.stripe.invoices.list(query, stripe);
  }

  // TODO (EK): Support upcoming invoices
  // TODO (EK): Support invoice line items
  _get (id, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.invoices.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.invoices.create(data, stripe);
  }

  _patch (id, data, params) {
    const { stripe } = normalizeParams(params);
    if (data.pay) {
      return this.stripe.invoices.pay(id, stripe);
    }
    return this._update(id, data, params);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    return this.stripe.invoices.update(id, data, stripe);
  }
};
