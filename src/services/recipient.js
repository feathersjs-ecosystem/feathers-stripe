import errorHandler from '../error-handler';
import normalizeQuery from '../normalize-query';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:recipient');

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
    return this.stripe.recipients.list(query).catch(errorHandler);
  }

  get(id) {
    return this.stripe.recipients.retrieve(id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.recipients.create(data).catch(errorHandler);
  }

  patch(... args) {
    return this.update(...args);
  }

  update(id, data) {
    return this.stripe.recipients.update(id, data).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:recipient plugin');

  return new Service(options);
}

init.Service = Service;
