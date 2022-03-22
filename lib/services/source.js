const makeDebug = require('debug');
const Base = require('./base');

const debug = makeDebug('feathers-stripe:source');

module.exports = class Service extends Base {
  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.sources.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    const { customer, ...rest } = stripe;
    if (customer) {
      return this.stripe.customers.createSource(customer, data, rest);
    }
    return this.stripe.sources.create(data, rest);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.sources.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    const { customer, ...rest } = stripe;
    if (!customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.deleteSource(customer, id, rest);
  }
};
