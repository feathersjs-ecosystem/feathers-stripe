const Base = require('./base');
const errorHandler = require('../error-handler');

module.exports = class Service extends Base {
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
