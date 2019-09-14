const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.disputes.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.disputes.retrieve(id, query).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.disputes.update(id, data).catch(errorHandler);
  }
};
