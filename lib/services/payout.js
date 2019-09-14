const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');
const Base = require('./base');

module.exports = class Service extends Base {
  find (params) {
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.payouts.list(query).catch(errorHandler);
  }

  get (id, params) {
    const query = normalizeQuery(params);
    return this.stripe.payouts.retrieve(id, query).catch(errorHandler);
  }

  create (data) {
    // Pull out stripe connect arguments
    const { connect = {} } = data;

    // Remove connect from main arguments
    delete data.connect;

    return this.stripe.payouts.create(data, connect).catch(errorHandler);
  }

  patch (...args) {
    return this.update(...args);
  }

  update (id, data) {
    return this.stripe.payouts.update(id, data).catch(errorHandler);
  }

  remove (id) {
    return this.stripe.payouts.close(id).catch(errorHandler);
  }
};
