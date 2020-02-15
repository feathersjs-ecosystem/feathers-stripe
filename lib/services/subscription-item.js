const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.subscriptionItems.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.subscriptionItems
      .retrieve(id, query)
      .catch(errorHandler);
  }

  create (data) {
    return this.stripe.subscriptionItems.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.subscriptionItems.update(id, data).catch(errorHandler);
  }

  remove (id, params) {
    return this.stripe.subscriptionItems
      .del(id, params.stripe ? params.stripe : {})
      .catch(errorHandler);
  }
};
