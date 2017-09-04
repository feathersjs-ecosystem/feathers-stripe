import errorHandler from '../error-handler';
import normalizeQuery from '../normalize-query';
import makeDebug from 'debug';
import Stripe from 'stripe';

const debug = makeDebug('feathers-stripe:external-account');

class Service {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
  }

  find (params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.accounts
      .listExternalAccounts(params.account, query)
      .catch(errorHandler);
  }

  get (id, params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.customers
      .retrieveExternalAccount(params.account, id)
      .catch(errorHandler);
  }

  create (data, params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts
      .createExternalAccount(params.account, data)
      .catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data, params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts
      .updateExternalAccount(params.account, id, data)
      .catch(errorHandler);
  }

  remove (id, params) {
    if (!params || !params.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts
      .deleteExternalAccount(params.account, id)
      .catch(errorHandler);
  }
}

export default function init (options) {
  debug('Initializing feathers-stripe:external-account plugin');

  return new Service(options);
}

init.Service = Service;
