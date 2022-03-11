const Base = require('./base');

module.exports = class Service extends Base {
  _create (data) {
    return this.stripe.accountLinks.create(data);
  }

  create (data) {
    return this._create(data);
  }
};
