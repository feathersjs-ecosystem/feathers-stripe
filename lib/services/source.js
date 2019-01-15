const errorHandler = require('../error-handler');
const Base = require('./base');

module.exports = class Service extends Base {
  get(id) {
    return this.stripe.sources.retrieve(id).catch(errorHandler);
  }

  create(data) {
    return this.stripe.sources.create(data).catch(errorHandler);
  }

  patch(id, data) {
    return this.update(id, data);
  }

  update(id, data) {
    return this.stripe.sources.update(id, data).catch(errorHandler);
  }
};
