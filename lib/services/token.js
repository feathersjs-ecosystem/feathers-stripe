const errorHandler = require('../error-handler');
const Stripe = require('stripe');

module.exports = class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  get (id) {
    return this.stripe.tokens.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.tokens.create(data).catch(errorHandler);
  }
};
