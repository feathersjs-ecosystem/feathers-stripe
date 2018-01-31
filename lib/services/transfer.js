const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const makeDebug = require('debug');
const Stripe = require('stripe');

const debug = makeDebug('feathers-stripe:transfer');

class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.transfers.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.transfers.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.transfers.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.transfers.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.transfers.createReversal(id).catch(errorHandler);
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:transfer plugin');

  return new Service(options);
};

module.exports.Service = Service;
