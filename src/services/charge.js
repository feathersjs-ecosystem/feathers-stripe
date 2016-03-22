import errorHandler from '../error-handler';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:charge');

class Service {
  constructor(options = {}) {

    if (!options.apiKey) {
      throw new Error('Stripe `apiKey` needs to be provided');
    }

    this.stripe = Stripe(options.apiKey);
    this.paginate = options.paginate = {};
  }

  find(params) {
    // TODO (EK): Handle pagination
    // TODO handle any special query params
    return this.stripe.charges.list(params.query).catch(errorHandler);
  }

  get(id) {
    return this.stripe.charges.retrieve(id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.charges.create(data).catch(errorHandler);
  }

  patch(... args) {
    return this.update(...args);
  }

  update(id, data) {
    return this.stripe.charges.update(id, data).catch(errorHandler);
  }

  remove(id) {
    return this.stripe.charges.del(id).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:charge plugin');

  return new Service(options);
}

init.Service = Service;
