const { normalizeQuery } = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.disputes.list(query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.disputes.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _patch (...args) {
    return this._update(...args);
  }

  patch (...args) {
    return this._patch(...args);
  }

  _update (id, data) {
    return this.stripe.disputes.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }
};
