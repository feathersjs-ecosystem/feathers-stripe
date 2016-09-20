import errorHandler from '../error-handler';
import normalizeQuery from '../normalize-query';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:invoice');

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
    return this.stripe.invoices.list(query).catch(errorHandler);
  }

  // TODO (EK): Support upcoming invoices
  // TODO (EK): Support invoice line items
  get(id) {
    return this.stripe.invoices.retrieve(id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.invoices.create(data).catch(errorHandler);
  }

  patch(id, data) {
    if (data.pay) {
      return this.stripe.invoices.pay(id).catch(errorHandler);
    }

    return this.update(id, data);
  }

  update(id, data) {
    return this.stripe.invoices.update(id, data).catch(errorHandler);
  }
}

export default function init(options) {
  debug('Initializing feathers-stripe:invoice plugin');

  return new Service(options);
}

init.Service = Service;
