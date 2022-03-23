const Base = require('./base');
const makeDebug = require('debug');

const debug = makeDebug('feathers-stripe:transferReversal');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    const { transfer, ...query } = filtered.query;
    if (!transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.handlePaginate(
      filtered,
      this.stripe.transfers.listReversals(transfer, query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.stripe.transfers.retrieveReversal(query.transfer, id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    const { transfer, ...rest } = data;
    if (!transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.stripe.transfers.createReversal(transfer, rest, stripe);
  }

  _update (id, data, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.transfer) {
      debug('Missing Stripe transfer id');
    }
    return this.stripe.transfers.updateReversal(
      query.transfer,
      id,
      data,
      stripe
    );
  }
};
