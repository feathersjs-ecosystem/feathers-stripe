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

  find () {
    // TODO (EK): Handle pagination
    // NOTE (EK): Stripe doesn't accept params for this method
    return this.stripe.balance.retrieve().catch(errorHandler);
  }

  get () {
    // NOTE (EK): Stripe doesn't accept params for this method
    return this.stripe.balance.retrieve().catch(errorHandler);
  }
};
