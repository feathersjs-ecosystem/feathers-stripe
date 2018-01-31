const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Stripe = require('stripe');

module.exports = class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.invoices.list(query).catch(errorHandler);
  }

  // TODO (EK): Support upcoming invoices
  // TODO (EK): Support invoice line items
  get (id) {
    return this.stripe.invoices.retrieve(id).catch(errorHandler);
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
