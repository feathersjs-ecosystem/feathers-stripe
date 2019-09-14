const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.tokens.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    return this.stripe.tokens.create(data).catch(errorHandler);
  }
};
