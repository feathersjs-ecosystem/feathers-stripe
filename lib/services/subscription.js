const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.subscriptions.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.subscriptions.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.subscriptions.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.subscriptions.update(id, data).catch(errorHandler);
  }

  remove (id, params) {
    return this.stripe.subscriptions.del(id, params.stripe).catch(errorHandler);
  }
};
