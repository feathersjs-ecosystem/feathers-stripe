import errorHandler from '../error-handler';
import normalizeQuery from '../normalize-query';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:event');

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
    const query = normalizeQuery(params);
    return this.stripe.events.list(query).catch(errorHandler);
  }

  get(id) {
    return this.stripe.events.retrieve(id).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:event plugin');

  return new Service(options);
}

init.Service = Service;
