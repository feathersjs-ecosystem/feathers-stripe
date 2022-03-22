const Stripe = require('stripe');
const { NotImplemented } = require('@feathersjs/errors');
const errorHandler = require('../error-handler');

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

  find (...args) {
    if (!this._find) {
      throw new NotImplemented();
    }
    return this._find(...args).catch(errorHandler);
  }

  get (...args) {
    if (!this._get) {
      throw new NotImplemented();
    }
    return this._get(...args).catch(errorHandler);
  }

  create (...args) {
    if (!this._create) {
      throw new NotImplemented();
    }
    return this._create(...args).catch(errorHandler);
  }

  update (...args) {
    if (!this._update) {
      throw new NotImplemented();
    }
    return this._update(...args).catch(errorHandler);
  }

  patch (...args) {
    if (this._patch) {
      return this._patch(...args).catch(errorHandler);
    }
    if (!this._update) {
      throw new NotImplemented();
    }
    return this._update(...args).catch(errorHandler);
  }

  remove (...args) {
    if (!this._remove) {
      throw new NotImplemented();
    }
    return this._remove(...args).catch(errorHandler);
  }
};
