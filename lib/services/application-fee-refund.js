const makeDebug = require('debug');
const Base = require('./base');

const debug = makeDebug('feathers-stripe:application-fee-refund');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    if (!filtered.query.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...query } = filtered.query;
    return this.handlePaginate(
      filtered,
      this.stripe.applicationFees.listRefunds(fee, query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.retrieveRefund(fee, id, rest);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.createRefund(fee, data, rest);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.updateRefund(fee, id, data, rest);
  }
};
