const errorHandler = require('../error-handler');
const makeDebug = require('debug');
const Stripe = require('stripe');

const debug = makeDebug('feathers-stripe:token');

class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  get (id) {
    return this.stripe.tokens.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.tokens.create(data).catch(errorHandler);
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:token plugin');

  return new Service(options);
};

module.exports.Service = Service;
