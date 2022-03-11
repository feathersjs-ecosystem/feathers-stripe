const Base = require('./base');

const errorHandler = require('../error-handler');

module.exports = class Service extends Base {
  _create (data) {
    return this.stripe.accountLinks.create(data);
  }

  create (data) {
    return this._create(data);
  }
};
