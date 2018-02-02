const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.events.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.events.retrieve(id).catch(errorHandler);
  }
};
