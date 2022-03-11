const makeDebug = require('debug');
const Base = require('./base');

const errorHandler = require('../error-handler');
const { normalizeQuery } = require('../normalize-query');

const debug = makeDebug('feathers-stripe:application-fee-refund');

module.exports = class Service extends Base {
  _find (params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.applicationFees.listRefunds(params.fee, query).catch(errorHandler);
  }

  find (params) {
    return this._find(params);
  }

  _get (id, params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    return this.stripe.applicationFees.retrieveRefund(params.fee, id).catch(errorHandler);
  }

  get (id, params) {
    return this._get(id, params);
  }

  _create (data, params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    return this.stripe.applicationFees.createRefund(params.fee, data).catch(errorHandler);
  }

  create (data, params) {
    return this._create(data, params);
  }

  _patch (id, data, params) {
    return this._update(id, data, params);
  }

  patch (id, data, params) {
    return this._patch(id, data, params);
  }

  _update (id, data, params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    return this.stripe.applicationFees.updateRefund(params.fee, id, data).catch(errorHandler);
  }

  update (id, data, params) {
    return this._update(id, data, params);
  }
};
