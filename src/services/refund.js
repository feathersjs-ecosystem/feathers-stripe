import errorHandler from '../error-handler';
import normalizeQuery from '../normalize-query';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:refund');

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
    return this.stripe.refunds.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.refunds.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.refunds.create(data).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.refunds.update(id, data).catch(errorHandler);
  }
}

export default function init (options) {
  debug('Initializing feathers-stripe:refund plugin');

  return new Service(options);
}

init.Service = Service;
