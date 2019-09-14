const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.orders.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.orders.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.orders.create(data).catch(errorHandler);
  }

  patch (id, data) {
    if (data.pay) {
      const payload = Object.assign({}, data);
      delete payload.pay;

      this.stripe.orders.pay(id, payload).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.orders.update(id, data).catch(errorHandler);
  }
};
