const Base = require('./base');

module.exports = class Service extends Base {
  _find (params) {
    const { query, stripe } = this.filterParams(params);
    return this.stripe.recipients.list(query, stripe);
  }

  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.recipients.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.recipients.create(data, stripe);
  }

  _update (id, data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.recipients.update(id, data, stripe);
  }
};
