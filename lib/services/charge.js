const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const makeDebug = require('debug');
const Stripe = require('stripe');

const debug = makeDebug('feathers-stripe:charge');

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
    return this.stripe.charges.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.charges.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.charges.create(data).catch(errorHandler);
  }

  patch (id, data) {
    if (data.capture) {
      return this.stripe.charges.capture(id).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.charges.update(id, data).catch(errorHandler);
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:charge plugin');

  return new Service(options);
};

module.exports.Service = Service;
