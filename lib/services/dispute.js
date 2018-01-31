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
    return this.stripe.disputes.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.disputes.retrieve(id).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.disputes.update(id, data).catch(errorHandler);
  }
};
