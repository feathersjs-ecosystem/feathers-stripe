import errorHandler from '../error-handler';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:card');

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
    return this.stripe.cards.list(params).catch(errorHandler);
  }

  get(id) {
    return this.stripe.cards.retrieve(id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.cards.create(data).catch(errorHandler);
  }

  patch(... args) {
    return this.update(...args);
  }

  update(id, data) {
    return this.stripe.cards.update(id, data).catch(errorHandler);
  }

  remove(id) {
    return this.stripe.cards.del(id).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:card plugin');

  return new Service(options);
}

init.Service = Service;
