const Stripe = require('stripe');

module.exports = class BaseService {
  constructor (secretKey, config = {}) {
    // If first parameter is an object, we assume the old behavior of passing in secretKey
    if(typeof secretKey === 'object') {
      secretKey = secretKey.secretKey;
      this.paginate = secretKey.paginate;
    }

    if (!secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.stripe = Stripe(secretKey, config);
    this.id = 'id';
  }
};
