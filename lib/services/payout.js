const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const makeDebug = require('debug');
const Stripe = require('stripe');

const debug = makeDebug('feathers-stripe:payout');

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
    return this.stripe.payouts.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.payouts.retrieve(id).catch(errorHandler);
  }

  create (data) {
    // Pull out stripe connect arguments
    const { connect = {} } = data;

    // Remove connect from main arguments
    delete data.connect;

    return this.stripe.payouts.create(data, connect).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.payouts.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.payouts.close(id).catch(errorHandler);
  }
}

module.exports = function init (options) {
  debug('Initializing feathers-stripe:payout plugin');

  return new Service(options);
};

module.exports.Service = Service;
