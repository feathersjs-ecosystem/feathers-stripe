const Base = require('./base');

const errorHandler = require('../error-handler');

module.exports = class Service extends Base {
  create (data) {
    return this.stripe.accountLinks.create(data).catch(errorHandler);
  }
};
