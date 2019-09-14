const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.paymentIntents.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.paymentIntents.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.paymentIntents.create(data).catch(errorHandler);
  }

  patch (id, data) {
    if (data.capture) {
      return this.stripe.paymentIntents.capture(id).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.paymentIntents.update(id, data).catch(errorHandler);
  }
};
