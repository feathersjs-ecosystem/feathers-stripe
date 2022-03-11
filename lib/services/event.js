const { normalizeQuery } = require('../normalize');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.events.list(query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.events.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }
};
