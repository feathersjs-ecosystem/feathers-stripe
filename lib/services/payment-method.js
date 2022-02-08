const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.paymentMethods.list(query).catch(errorHandler);
  }

  find (params) {
    return this._find(params);
  }

  _get (id) {
    return this.stripe.paymentMethods.retrieve(id).catch(errorHandler);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.paymentMethods.create(data).catch(errorHandler);
  }

  create (data) {
    return this._create(data);
  }

  _patch (id, data) {
    const { attach, ...rest } = data;

    if (attach) {
      return this.stripe.paymentMethods.attach(id, rest).catch(errorHandler);
    }

    return this._update(id, data);
  }

  patch (...args) {
    return this._patch(...args);
  }

  _update (id, data) {
    return this.stripe.paymentMethods.update(id, data).catch(errorHandler);
  }

  update (id, data) {
    return this._update(id, data);
  }

  _remove (id) {
    return this.stripe.paymentMethods.detach(id).catch(errorHandler);
  }

  remove (id) {
    return this._remove(id);
  }
};
