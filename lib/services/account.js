const Stripe = require('stripe');

const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');

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
    return this.stripe.accounts.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.accounts.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.accounts.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.accounts.update(id, data).catch(errorHandler);
  }
};
