const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.balance.listTransactions(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.balance.retrieveTransaction(id).catch(errorHandler);
  }
};
