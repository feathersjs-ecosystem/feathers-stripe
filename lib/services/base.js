const Stripe = require('stripe');
const { AdapterService } = require('@feathersjs/adapter-commons');
const errors = require('@feathersjs/errors');
const { _ } = require('@feathersjs/commons');

module.exports = class BaseService extends AdapterService {
  constructor (options, ...rest) {
    super(options, ...rest);
    if (!options.secretKey && !options.stripe) {
      throw new Error('Stripe service option `secretKey` or `stripe` needs to be provided');
    }
    if (options.stripe) {
      this.stripe = options.stripe;
    } else {
      this.stripe = Stripe(options.secretKey);
    }
  }

  find (...args) {
    return this._find(...args).catch(this.handleError);
  }

  get (...args) {
    return this._get(...args).catch(this.handleError);
  }

  create (...args) {
    return this._create(...args).catch(this.handleError);
  }

  update (...args) {
    return this._update(...args).catch(this.handleError);
  }

  patch (...args) {
    if (this._patch) {
      return this._patch(...args).catch(this.handleError);
    }
    return this._update(...args).catch(this.handleError);
  }

  remove (...args) {
    return this._remove(...args).catch(this.handleError);
  }

  getLimit (limit) {
    const { paginate } = this.options.paginate;
    if (paginate && (paginate.default || paginate.max)) {
      const base = paginate.default || 0;
      const lower = typeof limit === 'number' && !isNaN(limit) ? limit : base;
      const upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;

      return Math.min(lower, upper);
    }
    return limit;
  }

  cleanQuery (query) {
    if (Array.isArray(query)) {
      return query.map((item) => this.cleanQuery(item));
    }
    if (_.isObject(query)) {
      const result = Object.assign({}, query);
      Object.entries(result).forEach(([key, value]) => {
        if (key.startsWith('$')) {
          delete result[key];
        }
        const cleanKey = key.replace('$', '');
        result[cleanKey] = this.cleanQuery(value);
      });
      return result;
    }
    return query;
  }

  filterQuery (params) {
    const query = Object.assign({}, params.query);
    if (query.$limit) {
      query.limit = this.getLimit(query.$limit);
      delete query.$limit;
    }
    return this.cleanQuery(query);
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

  handleError (error) {
    let feathersError = error;

    if (error.type) {
      switch (error.type) {
        case 'StripeCardError':
          // A declined card error
          feathersError = new errors.PaymentError(error, error);
          break;
        case 'StripeInvalidRequestError':
        case 'StripeInvalidRequest':
          // Invalid parameters were supplied to Stripe's API
          feathersError = new errors.BadRequest(error, error);
          break;
        case 'StripeAPIError':
          // An error occurred internally with Stripe's API
          feathersError = new errors.Unavailable(error, error);
          break;
        case 'StripeConnectionError':
          // Some kind of error occurred during the HTTPS communication
          feathersError = new errors.Unavailable(error, error);
          break;
        case 'StripeAuthenticationError':
          // You probably used an incorrect API key
          feathersError = new errors.NotAuthenticated(error, error);
          break;
        default:
          feathersError = new errors.GeneralError(
            'Unknown Payment Gateway Error',
            error
          );
      }
    }

    return Promise.reject(feathersError);
  }
};
