import errorHandler from '../error-handler';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:plan');

class Service {
  constructor(options = {}) {

    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find(params) {
    // TODO (EK): Handle pagination
    // TODO handle any special query params
    return this.stripe.plans.list(params).catch(errorHandler);
  }

  get(id) {
    return this.stripe.plans.retrieve(id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.plans.create(data).catch(errorHandler);
  }

  patch(... args) {
    return this.update(...args);
  }

  update(id, data) {
    return this.stripe.plans.update(id, data).catch(errorHandler);
  }

  remove(id) {
    return this.stripe.plans.del(id).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:plan plugin');

  return new Service(options);
}

init.Service = Service;
