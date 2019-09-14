const errorHandler = require('../error-handler');
const Base = require('./base');

module.exports = class Service extends Base {
  get (id, params) {
    return this.stripe.tokens.retrieve(id, params).catch(errorHandler);
  }

  create (data) {
    return this.stripe.tokens.create(data).catch(errorHandler);
  }
};
