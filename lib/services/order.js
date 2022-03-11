const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.orders.list(query).catch(errorHandler);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.orders.retrieve(id).catch(errorHandler);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.orders.create(data).catch(errorHandler);
  }

  create (data, params) {
    return this._create(data, params);
  }

  _patch (id, data) {
    if (data.pay) {
      const payload = Object.assign({}, data);
      delete payload.pay;

      this.stripe.orders.pay(id, payload).catch(errorHandler);
    }

    return this._update(id, data);
  }

  patch (id, data) {
    return this._patch(id, data);
  }

  _update (id, data) {
    return this.stripe.orders.update(id, data).catch(errorHandler);
  }

  update (id, data) {
    return this._update(id, data);
  }
};
