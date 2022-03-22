const Base = require('./base');
const makeDebug = require('debug');

const debug = makeDebug('feathers-stripe:external-account');

class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    const { account, ...rest } = filtered.stripe;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.handlePaginate(
      filtered,
      this.stripe.accounts.listExternalAccounts(account, filtered.query, rest)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    const { account, ...rest } = stripe;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.customers.retrieveExternalAccount(account, id, rest)
    ;
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    const { account, ...rest } = stripe;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.createExternalAccount(account, data, rest)
    ;
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    const { account, ...rest } = stripe;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.updateExternalAccount(account, id, data, rest)
    ;
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    const { account, ...rest } = stripe;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.deleteExternalAccount(account, id, rest)
    ;
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:external-account plugin');

  return new Service(options);
};

module.exports.Service = Service;
