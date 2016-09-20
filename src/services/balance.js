import errorHandler from '../error-handler';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:balance');

class Service {
  constructor(options = {}) {

    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find() {
    // TODO (EK): Handle pagination
    // NOTE (EK): Stripe doesn't accept params for this method
    return this.stripe.balance.retrieve().catch(errorHandler);
  }

  get() {
    // NOTE (EK): Stripe doesn't accept params for this method
    return this.stripe.balance.retrieve().catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:balance plugin');

  return new Service(options);
}

init.Service = Service;
