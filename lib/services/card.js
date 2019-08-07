const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const makeDebug = require('debug');
const Base = require('./base');

const debug = makeDebug('feathers-stripe:card');

module.exports = class Service extends Base {
  find (params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.customers.listSources(params.customer, query).catch(errorHandler);
  }

  get (id, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.retrieveSource(params.customer, id).catch(errorHandler);
  }

  create (data, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.createSource(params.customer, data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.updateSource(params.customer, id, data).catch(errorHandler);
  }

  remove (id, params) {
    if (!params || !params.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.deleteSource(params.customer, id).catch(errorHandler);
  }
};
