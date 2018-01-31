const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const makeDebug = require('debug');
const Stripe = require('stripe');

const debug = makeDebug('feathers-stripe:transferReversal');

class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find (params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.transfers.listReversals(params.transfer, query).catch(errorHandler);
  }

  get (id, params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }

    return this.stripe.transfers.retrieveReversal(params.transfer, id).catch(errorHandler);
  }

  create (data, params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }

    return this.stripe.transfers.createReversal(params.transfer, data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data, params) {
    if (!params || !params.transfer) {
      debug('Missing Stripe transfer id');
    }

    return this.stripe.transfers.updateReversal(params.transfer, id, data).catch(errorHandler);
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:transferReversal plugin');

  return new Service(options);
};

module.exports.Service = Service;
