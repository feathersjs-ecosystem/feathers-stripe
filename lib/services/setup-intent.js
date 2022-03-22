const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = this.filterParams(params);
    return this.stripe.setupIntents.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.setupIntents.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.setupIntents.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.setupIntents.update(id, data, stripe);
  }
};
