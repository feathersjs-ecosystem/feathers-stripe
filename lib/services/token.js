const Base = require('./base');

module.exports = class Service extends Base {
  _get (id) {
    return this.stripe.tokens.retrieve(id);
  }

  get (id) {
    return this._get(id);
  }

  _create (data) {
    return this.stripe.tokens.create(data);
  }

  create (data) {
    return this._create(data);
  }
};
