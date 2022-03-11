const { normalizeParams } = require('../normalize');
const Base = require('./base');
const makeDebug = require('debug');

const debug = makeDebug('feathers-stripe:transferReversal');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    const { transfer, ...rest } = stripe;
    if (!transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.stripe.transfers.listReversals(transfer, query, rest);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    const { transfer, ...rest } = stripe;
    if (!transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.stripe.transfers.retrieveReversal(transfer, id, rest);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    const { transfer, ...rest } = stripe;
    if (!transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.stripe.transfers.createReversal(transfer, data, rest);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    const { transfer, ...rest } = stripe;
    if (!transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.stripe.transfers.updateReversal(transfer, id, data, rest);
  }
};
