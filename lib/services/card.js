const makeDebug = require('debug');
const Base = require('./base');

const debug = makeDebug('feathers-stripe:card');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    const { customer, ...query } = filtered.query;
    if (!customer) {
      debug('Missing Stripe customer id');
    }
    return this.handlePaginate(
      filtered,
      this.stripe.customers.listSources(customer, query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.retrieveSource(query.customer, id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    const { customer, ...rest } = data;
    if (!customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.createSource(customer, rest, stripe);
  }

  _update (id, data, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.updateSource(query.customer, id, data, stripe);
  }

  _remove (id, params) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.deleteSource(query.customer, id, stripe);
  }
};
