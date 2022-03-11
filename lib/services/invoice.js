const errorHandler = require('../error-handler');
const { normalizeQuery } = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.invoices.list(query);
  }

  find (params) {
    return this._find(params);
  }

  // TODO (EK): Support upcoming invoices
  // TODO (EK): Support invoice line items
  _get (id) {
    return this.stripe.invoices.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.invoices.create(data);
  }

  create (data) {
    return this._create(data);
  }

  _patch (id, data) {
    if (data.pay) {
      return this.stripe.invoices.pay(id);
    }

    return this._update(id, data);
  }

  patch (...args) {
    return this._patch(...args);
  }

  _update (id, data) {
    return this.stripe.invoices.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }
};
