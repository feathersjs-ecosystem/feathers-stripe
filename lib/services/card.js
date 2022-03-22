const makeDebug = require('debug');
const Base = require('./base');

const debug = makeDebug('feathers-stripe:card');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = this.filterParams(params);
    if (!stripe.customer) {
      debug('Missing Stripe customer id');
    }
    const { customer, ...rest } = stripe;
    return this.stripe.customers.listSources(customer, query, rest);
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    if (!stripe.customer) {
      debug('Missing Stripe customer id');
    }
    const { customer, ...rest } = stripe;
    return this.stripe.customers.retrieveSource(customer, id, rest);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    if (!stripe.customer) {
      debug('Missing Stripe customer id');
    }
    const { customer, ...rest } = stripe;
    return this.stripe.customers.createSource(customer, data, rest);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    if (!stripe.customer) {
      debug('Missing Stripe customer id');
    }
    const { customer, ...rest } = stripe;
    return this.stripe.customers.updateSource(customer, id, data, rest);
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    if (!stripe.customer) {
      debug('Missing Stripe customer id');
    }
    const { customer, ...rest } = stripe;
    return this.stripe.customers.deleteSource(customer, id, rest);
  }
};
