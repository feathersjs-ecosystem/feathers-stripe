const errorHandler = require('../error-handler');
const Base = require('./base');

module.exports = class Service extends Base {
  get (id) {
    return this.stripe.tokens.retrieve(id).catch(errorHandler);
  }

  create (data) {
    return this.stripe.tokens.create(data).catch(errorHandler);
  }
};
