import errorHandler from '../error-handler';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:card');

class Service {
  constructor(options = {}) {

    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find(params) {
    return this.stripe.customers.listCards(params).catch(errorHandler);
  }

  get(id) {
    return this.stripe.customers.retrieveCard(params.customer, id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.customers.createSource(params.customer, data).catch(errorHandler);
  }

  patch(... args) {
    return this.update(...args);
  }

  update(id, data) {
    return this.stripe.customers.updateCard(params.customer, id, data).catch(errorHandler);
  }

  remove(id) {
    return this.stripe.customers.deleteCard(params.customer, id).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:card plugin');

  return new Service(options);
}

init.Service = Service;
