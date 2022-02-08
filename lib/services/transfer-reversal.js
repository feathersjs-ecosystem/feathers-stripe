const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');
const makeDebug = require('debug');

const debug = makeDebug('feathers-stripe:transferReversal');

module.exports = class Service extends Base {
  _find (params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.transfers.listReversals(params.transfer, query).catch(errorHandler);
  }

  find (params) {
    return this._find(params);
  }

  _get (id, params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }

    return this.stripe.transfers.retrieveReversal(params.transfer, id).catch(errorHandler);
  }

  get (id, params) {
    return this._get(id, params);
  }

  _create (data, params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }

    return this.stripe.transfers.createReversal(params.transfer, data).catch(errorHandler);
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

  _update (id, data, params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }

    return this.stripe.transfers.updateReversal(params.transfer, id, data).catch(errorHandler);
  }

  update (id, data, params) {
    return this._update(id, data, params);
  }
};
