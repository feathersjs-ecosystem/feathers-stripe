const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.recipients.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.recipients.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.recipients.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.recipients.update(id, data).catch(errorHandler);
  }
};
