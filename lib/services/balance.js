const Base = require('./base');
const errorHandler = require('../error-handler');

module.exports = class Service extends Base {
  _find (params) {
    if (params && params.query) {
      return this.stripe.balance.retrieve(params.query).catch(errorHandler);
    }
    return this.stripe.balance.retrieve().catch(errorHandler);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.balance.retrieve({
      stripe_account: id
    }).catch(errorHandler);
  }

  get (id) {
    return this._get(id);
  }
};
