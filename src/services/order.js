import errorHandler from '../error-handler';
import normalizeQuery from '../normalize-query';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:order');

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
    return this.stripe.orders.list(query).catch(errorHandler);
  }

  get (id) {
    return this.stripe.orders.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.orders.create(data).catch(errorHandler);
  }

  patch (id, data) {
    if (data.pay) {
      const payload = Object.assign({}, data);
      delete payload.pay;

      this.stripe.orders.pay(id, payload).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update (id, data) {
    return this.stripe.orders.update(id, data).catch(errorHandler);
  }
}

export default function init (options) {
  debug('Initializing feathers-stripe:order plugin');

  return new Service(options);
}

init.Service = Service;
