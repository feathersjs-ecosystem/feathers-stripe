const { normalizeQuery } = require('../normalize-query');
const makeDebug = require('debug');
const Base = require('./base');

const debug = makeDebug('feathers-stripe:card');

module.exports = class Service extends Base {
  _find (params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);

    if (!query.type) {
      query.type = 'bank_account';
    }

    return this.stripe.customers.listSources(params.customer, query);
  }

  find (params) {
    return this._find(params);
  }

  _get (id, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.retrieveSource(params.customer, id);
  }

  get (id, params) {
    return this._get(id, params);
  }

  _create (data, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.createSource(params.customer, data);
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
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.updateCard(params.customer, id, data);
  }

  update (id, data, params) {
    return this._update(id, data, params);
  }

  _remove (id, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.deleteSource(params.customer, id);
  }

  remove (id, params) {
    return this._remove(id, params);
  }
};
