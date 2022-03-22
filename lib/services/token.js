

module.exports = class Service extends Base {
  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.tokens.retrieve(id, stripe);
  }

  _create (data, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.tokens.create(data, stripe);
  }
};
