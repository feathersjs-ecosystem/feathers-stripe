const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = this.filterParams(params);
    return this.stripe.transfers.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.createReversal(id, stripe);
  }
};
