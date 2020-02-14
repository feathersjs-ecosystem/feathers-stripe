const Stripe = require('stripe');

module.exports = class BaseService {
  constructor (secretKey, config = {}) {
    if (!secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(secretKey, config);
    this.paginate = options.paginate = {};
    this.id = 'id';
  }
};
