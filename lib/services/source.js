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
    const { customer, ...rest } = data;
    if (customer) {
      return this.stripe.customers.createSource(customer, rest, stripe);
    }
    return this.stripe.sources.create(rest, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.sources.update(id, data, stripe);
  }

  _remove (id, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.deleteSource(query.customer, id, stripe);
  }
};
