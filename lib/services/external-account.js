const Base = require('./base');
const makeDebug = require('debug');

const debug = makeDebug('feathers-stripe:external-account');

class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    const { account, ...query } = filtered.query;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.handlePaginate(
      filtered,
      this.stripe.accounts.listExternalAccounts(account, query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.customers.retrieveExternalAccount(
      query.account,
      id,
      stripe
    );
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    const { account, ...rest } = data;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.createExternalAccount(account, rest, stripe);
  }

  _update (id, data, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.updateExternalAccount(
      query.account,
      id,
      data,
      stripe
    );
  }

  _remove (id, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.deleteExternalAccount(
      query.account,
      id,
      stripe
    );
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:external-account plugin');

  return new Service(options);
};

module.exports.Service = Service;
