const { normalizeQuery } = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.subscriptionItems.list(query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.subscriptionItems.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.subscriptionItems.create(data);
  }

  create (data) {
    return this._create(data);
  }

  _patch (...args) {
    return this._update(...args);
  }

  patch (...args) {
    return this._patch(...args);
  }

  _update (id, data) {
    return this.stripe.subscriptionItems.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }

  _remove (id, params) {
    return this.stripe.subscriptionItems.del(id, params.stripe);
  }

  remove (id, params) {
    return this._remove(id, params);
  }
};
