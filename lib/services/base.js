const Stripe = require('stripe');
const { MethodNotAllowed } = require('@feathersjs/errors');

module.exports = class BaseService {
  constructor (options = {}) {
    if (!options.secretKey) {
      throw new Error('Stripe `secretKey` needs to be provided');
    }

    this.options = { ...options };
    this.stripe = Stripe(options.secretKey);
    this.paginate = options.paginate = {};
    this.id = 'id';
  }

  get (...args) {
    if (!this._get) {
      throw new MethodNotAllowed();
    }
    return this._get(...args);
  }

  find (...args) {
    if (!this._find) {
      throw new MethodNotAllowed();
    }
    return this._find(...args);
  }

  create (...args) {
    if (!this._create) {
      throw new MethodNotAllowed();
    }
    return this._create(...args);
  }

  update (...args) {
    if (!this._update) {
      throw new MethodNotAllowed();
    }
    return this._update(...args);
  }

  patch (...args) {
    if (!this._update) {
      throw new MethodNotAllowed();
    }
    return this._update(...args);
  }

  remove (...args) {
    if (!this._remove) {
      throw new MethodNotAllowed();
    }
    return this._remove(...args);
  }
};
