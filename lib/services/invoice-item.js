const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.invoiceItems.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.invoiceItems.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.invoiceItems.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.invoiceItems.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.invoiceItems.del(id).catch(errorHandler);
  }
};
