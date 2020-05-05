const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.charges.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.charges.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.charges.create(data).catch(errorHandler);
  }

  patch (id, data) {
    if (data.capture) {
      delete data.capture;
      return this.stripe.charges.capture(id, data).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.charges.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.refunds.create({ charge: id }).catch(errorHandler);
  }
};
