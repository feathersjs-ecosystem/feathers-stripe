const Base = require('./base');

const errorHandler = require('../error-handler');

module.exports = class Service extends Base {
  _create (data) {
    return this.stripe.accountLinks.create(data).catch(errorHandler);
  }

  create (data) {
    return this._create(data);
  }
};
