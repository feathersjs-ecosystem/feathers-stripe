const makeDebug = require('debug');
const Base = require('./base');
const { normalizeParams } = require('../normalize');

const debug = makeDebug('feathers-stripe:application-fee-refund');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = normalizeParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.listRefunds(fee, query, rest);
  }

  _get (id, params) {
    const { stripe } = normalizeParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.retrieveRefund(fee, id, rest);
  }

  _create (data, params) {
    const { stripe } = normalizeParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.createRefund(fee, data, rest);
  }

  _update (id, data, params) {
    const { stripe } = normalizeParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.updateRefund(fee, id, data, rest);
  }
};
