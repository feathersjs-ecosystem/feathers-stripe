const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.payouts.list(filtered.query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.payouts.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    const { connect = {}, ...rest } = data;
    return this.stripe.payouts.create(rest, connect, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.payouts.update(id, data, stripe);
  }

  _remove (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.payouts.close(id, stripe);
  }
};
