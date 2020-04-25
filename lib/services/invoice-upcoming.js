const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    const query = normalizeQuery(params);
    return this.stripe.invoices.retrieveUpcoming(query).catch(errorHandler);
  }
};
