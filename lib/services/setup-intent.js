const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO: Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.setupIntents.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.setupIntents.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.setupIntents.create(data).catch(errorHandler);
  }

  patch (id, data) {
    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.setupIntents.update(id, data).catch(errorHandler);
  }
};
