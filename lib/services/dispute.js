const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.disputes.list(filtered.query, filtered.stripe)
    );
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.disputes.retrieve(id, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.disputes.update(id, data, stripe);
  }
};
