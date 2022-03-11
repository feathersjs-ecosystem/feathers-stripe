const { normalizeQuery } = require('../normalize');
const makeDebug = require('debug');
const Stripe = require('stripe');

const debug = makeDebug('feathers-stripe:external-account');

class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  _find (params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.accounts
      .listExternalAccounts(params.account, query)
    ;
  }

  find (params) {
    return this._find(params);
  }

  _get (id, params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.customers
      .retrieveExternalAccount(params.account, id)
    ;
  }

  get (id, params) {
    return this._get(id, params);
  }

  _create (data, params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts
      .createExternalAccount(params.account, data)
    ;
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
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts
      .updateExternalAccount(params.account, id, data)
    ;
  }

  update (id, data, params) {
    return this._update(id, data, params);
  }

  _remove (id, params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts
      .deleteExternalAccount(params.account, id)
    ;
  }

  remove (id, params) {
    return this._remove(id, params);
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:external-account plugin');

  return new Service(options);
};

module.exports.Service = Service;
