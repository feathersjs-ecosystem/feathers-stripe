const Base = require('./base');
const errorHandler = require('../error-handler');

module.exports = class Service extends Base {
  _find (params) {
    if (params && params.query) {
      return this.stripe.balance.retrieve(params.query);
    }
    return this.stripe.balance.retrieve();
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.balance.retrieve({
      stripe_account: id
    });
  }

  get (id) {
    return this._get(id);
  }
};
