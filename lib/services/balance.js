const Base = require('./base');
const errorHandler = require('../error-handler');

module.exports = class Service extends Base {
  find (params) {
    if (params && params.query) {
      return this.stripe.balance.retrieve(params.query).catch(errorHandler);
    }
    return this.stripe.balance.retrieve().catch(errorHandler);
  }

  get (stripe_account) {
    return this.stripe.balance.retrieve({
      stripe_account
    }).catch(errorHandler);
  }
};
