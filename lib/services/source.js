const errorHandler = require('../error-handler');
const makeDebug = require('debug');
const Base = require('./base');

const debug = makeDebug('feathers-stripe:source');

module.exports = class Service extends Base {
  _get (id) {
    return this.stripe.sources.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data, params) {
    if (params.customer) {
      return this.stripe.customers
        .createSource(params.customer, data)
        ;
    }
    return this.stripe.sources.create(data);
  }

  create (data, params) {
    return this._create(data, params);
  }

  _patch (id, data) {
    return this._update(id, data);
  }

  patch (...args) {
    return this._patch(...args);
  }

  _update (id, data) {
    return this.stripe.sources.update(id, data);
  }

  update (id, data) {
    return this._update(id, data);
  }

  _remove (id, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers
      .deleteSource(params.customer, id)
      ;
  }

  remove (id, params) {
    return this._remove(id, params);
  }
};
