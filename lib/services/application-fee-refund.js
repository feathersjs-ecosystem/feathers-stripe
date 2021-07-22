const Base = require('./base');

const errorHandler = require('../error-handler');
const normalizeQuery = require('../normalize-query');

module.exports = class Service extends Base {
  find (params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    // TODO (EK): Handle pagination
    const query = normalizeQuery(params);
    return this.stripe.applicationFees.listRefunds(params.fee, query).catch(errorHandler);
  }

  get (id, params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    return this.stripe.applicationFees.retrieveRefund(params.fee, id).catch(errorHandler);
  }

  create (data, params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    return this.stripe.applicationFees.createRefund(params.fee, data).catch(errorHandler);
  }

  patch (id, data, params) {
    return this.update(id, data, params);
  }

  update (id, data, params) {
    if (!params || !params.fee) {
      debug('Missing Stripe fee id');
    }
    return this.stripe.applicationFees.updateRefund(params.fee, id, data).catch(errorHandler);
  }
};
