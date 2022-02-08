const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.payouts.list(query).catch(errorHandler);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.payouts.retrieve(id).catch(errorHandler);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    // Pull out stripe connect arguments
    const { connect = {} } = data;

    // Remove connect from main arguments
    delete data.connect;

    return this.stripe.payouts.create(data, connect).catch(errorHandler);
  }

  create (data, params) {
    return this._create(data, params);
  }

  _patch (...args) {
    return this._update(...args);
  }

  patch (...args) {
    return this._patch(...args);
  }

  _update (id, data) {
    return this.stripe.payouts.update(id, data).catch(errorHandler);
  }

  update (id, data) {
    return this._update(id, data);
  }

  _remove (id) {
    return this.stripe.payouts.close(id).catch(errorHandler);
  }

  remove (id) {
    return this._remove(id);
  }
};
