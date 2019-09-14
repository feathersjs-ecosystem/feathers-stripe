const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.products.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.products.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.products.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.products.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.products.del(id).catch(errorHandler);
  }
};
