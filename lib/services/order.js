const { normalizeQuery } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.orders.list(query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.orders.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.orders.create(data);
  }

  create (data, params) {
    return this._create(data, params);
  }

  _patch (id, data) {
    if (data.pay) {
      const payload = Object.assign({}, data);
      delete payload.pay;

      this.stripe.orders.pay(id, payload);
    }

    return this._update(id, data);
  }

  patch (id, data) {
    return this._patch(id, data);
  }

  _update (id, data) {
    return this.stripe.orders.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }
};
