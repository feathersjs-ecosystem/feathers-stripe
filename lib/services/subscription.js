const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.subscriptions.list(query).catch(errorHandler);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.subscriptions.retrieve(id).catch(errorHandler);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.subscriptions.create(data).catch(errorHandler);
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
    return this.stripe.subscriptions.update(id, data).catch(errorHandler);
  }

  update (id, data) {
    return this._update(id, data);
  }

  _remove (id, params) {
    return this.stripe.subscriptions.del(id, params.stripe).catch(errorHandler);
  }

  remove (id, params) {
    return this._remove(id, params);
  }
};
