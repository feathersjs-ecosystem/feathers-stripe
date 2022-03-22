const Stripe = require('stripe');
const errorHandler = require('../error-handler');
const { AdapterService } = require('@feathersjs/adapter-commons');

module.exports = class BaseService extends AdapterService {
  constructor (options, ...rest) {
    super(options, ...rest);
    if (!options.secretKey || !options.stripe) {
      throw new Error('Stripe service option `secretKey` or `stripe` needs to be provided');
    }
    if (options.stripe) {
      this.stripe = options.stripe;
    } else {
      this.stripe = Stripe(options.secretKey);
    }
  }

  find (...args) {
    return this._find(...args).catch(errorHandler);
  }

  get (...args) {
    return this._get(...args).catch(errorHandler);
  }

  create (...args) {
    return this._create(...args).catch(errorHandler);
  }

  update (...args) {
    return this._update(...args).catch(errorHandler);
  }

  patch (...args) {
    if (this._patch) {
      return this._patch(...args).catch(errorHandler);
    }
    return this._update(...args).catch(errorHandler);
  }

  remove (...args) {
    return this._remove(...args).catch(errorHandler);
  }

  getLimit (limit) {
    const { paginate } = this.getOptions(params);
    if (paginate && (paginate.default || paginate.max)) {
      const base = paginate.default || 0;
      const lower = typeof limit === 'number' && !isNaN(limit) ? limit : base;
      const upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;

      return Math.min(lower, upper);
    }
    return limit;
  }

  filterQuery () {
    const query = Object.assign({}, params.query);
    if (query.$limit) {
      query.limit = getLimit(query.$limit);
      delete query.$limit;
    }
    return query;
  }

  filterParams (params) {
    if (!params) {
      return {
        query: {},
        stripe: {}
      };
    }
    const query = this.filterQuery(params);
    const stripe = params.stripe || {};
    return { query, stripe };
  }
};
