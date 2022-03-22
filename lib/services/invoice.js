const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.invoices.list(filtered.query, filtered.stripe)
    );
  }

  // TODO (EK): Support upcoming invoices
  // TODO (EK): Support invoice line items
  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoices.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoices.create(data, stripe);
  }

  _patch (id, data, params) {
    const { stripe } = this.filterParams(params);
    if (data.pay) {
      return this.stripe.invoices.pay(id, stripe);
    }
    return this._update(id, data, params);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoices.update(id, data, stripe);
  }
};
