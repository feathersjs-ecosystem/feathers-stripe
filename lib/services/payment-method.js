const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.paymentMethods.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.paymentMethods.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.paymentMethods.create(data).catch(errorHandler);
  }

  patch (id, data) {
    const { attach, ...rest } = data;

    if (attach) {
      return this.stripe.paymentMethods.attach(id, rest).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.paymentMethods.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.paymentMethods.detach(id).catch(errorHandler);
  }
};
