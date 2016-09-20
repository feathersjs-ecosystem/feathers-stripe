import errorHandler from '../error-handler';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:token');

class Service {
  constructor(options = {}) {

    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  get(id) {
    return this.stripe.tokens.retrieve(id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.tokens.create(data).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:token plugin');

  return new Service(options);
}

init.Service = Service;
