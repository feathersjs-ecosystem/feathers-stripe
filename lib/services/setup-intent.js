const { normalizeQuery } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO: Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.setupIntents.list(query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.setupIntents.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.setupIntents.create(data);
  }

  create (data) {
    return this._create(data);
  }

  _patch (id, data) {
    return this._update(id, data);
  }

  patch (id, data) {
    return this._patch(id, data);
  }

  _update (id, data) {
    return this.stripe.setupIntents.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }
};
