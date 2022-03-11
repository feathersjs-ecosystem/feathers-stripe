const errorHandler = require('../error-handler');
const { normalizeQuery } = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.charges.list(query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.charges.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.charges.create(data);
  }

  create (data) {
    return this._create(data);
  }

  _patch (id, _data) {
    const { capture, ...data } = _data;

    if (capture) {
      return this.stripe.charges.capture(id, data);
    }

    return this._update(id, data);
  }

  patch (...args) {
    return this._patch(...args);
  }

  _update (id, data) {
    return this.stripe.charges.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }

  _remove (id) {
    return this.stripe.refunds.create({ charge: id });
  }

  remove (id) {
    return this._remove(id);
  }
};
