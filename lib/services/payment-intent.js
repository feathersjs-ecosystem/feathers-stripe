const { normalizeQuery } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.paymentIntents.list(query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.paymentIntents.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.paymentIntents.create(data);
  }

  create (data) {
    return this._create(data);
  }

  _patch (id, data) {
    if (data.capture) {
      return this.stripe.paymentIntents.capture(id);
    }

    return this._update(id, data);
  }

  patch (id, data) {
    return this._patch(id, data);
  }

  _update (id, data) {
    return this.stripe.paymentIntents.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }
};
