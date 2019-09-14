const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.invoices.list(query).catch(errorHandler);
  }

  // TODO (EK): Support upcoming invoices
  // TODO (EK): Support invoice line items
  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.invoices.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.invoices.create(data).catch(errorHandler);
  }

  patch (id, data) {
    if (data.pay) {
      return this.stripe.invoices.pay(id).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.invoices.update(id, data).catch(errorHandler);
  }
};
