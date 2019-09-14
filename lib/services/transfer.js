const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.transfers.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.transfers.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.transfers.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.transfers.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.transfers.createReversal(id).catch(errorHandler);
  }
};
