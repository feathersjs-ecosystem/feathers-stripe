const Base = require('./base');

const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.accounts.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.accounts.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.accounts.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.accounts.update(id, data).catch(errorHandler);
  }
};
