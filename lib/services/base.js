const Stripe = require('stripe');
const { AdapterService } = require('@feathersjs/adapter-commons');
const errors = require('@feathersjs/errors');
const { _ } = require('@feathersjs/commons');

module.exports = class BaseService extends AdapterService {
  constructor (options, ...rest) {
    const opts = {
      // Stripe enforces 100 max and 10 default
      paginate: {
        default: 10,
        max: 100
      },
      ...options
    };
    super(opts, ...rest);
    if (!opts.secretKey && !opts.stripe) {
      throw new Error('Stripe service option `secretKey` or `stripe` needs to be provided');
    }
    if (opts.stripe) {
      this.stripe = opts.stripe;
    } else {
      this.stripe = Stripe(opts.secretKey);
    }
  }

  find (...args) {
    if (!this._find) {
      throw new errors.NotImplemented('Find method not implemented');
    }
    return this._find(...args).catch(this.handleError);
  }

  get (...args) {
    if (!this._get) {
      throw new errors.NotImplemented('Get method not implemented');
    }
    return this._get(...args).catch(this.handleError);
  }

  create (...args) {
    if (!this._create) {
      throw new errors.NotImplemented('Create method not implemented');
    }
    return this._create(...args).catch(this.handleError);
  }

  update (...args) {
    if (!this._update) {
      throw new errors.NotImplemented('Update method not implemented');
    }
    return this._update(...args).catch(this.handleError);
  }

  patch (...args) {
    if (this._patch) {
      return this._patch(...args).catch(this.handleError);
    }
    if (this._update) {
      return this._update(...args).catch(this.handleError);
    }
    throw new errors.NotImplemented('Patch method not implemented');
  }

  remove (...args) {
    if (!this._remove) {
      throw new errors.NotImplemented('Remove method not implemented');
    }
    return this._remove(...args).catch(this.handleError);
  }

  getLimit (limit, paramsPaginate) {
    if (paramsPaginate === false) {
      return limit;
    }
    const { paginate } = this.options;
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
    const limit = query.$limit || query.limit;
    if (limit) {
      query.limit = this.getLimit(limit, params.paginate);
      delete query.$limit;
    }
    return this.cleanQuery(query);
  }

  filterParams (params = {}) {
    return {
      query: this.filterQuery(params),
      stripe: params.stripe,
      paginate: params.paginate !== false
    };
  }

  async handlePaginate ({ paginate, query }, stripeMethod) {
    if (paginate) {
      return stripeMethod;
    }
    if (stripeMethod.autoPagingEach) {
      // NOTE: This is similar to stripe's autoPagingToArray
      // but bypasses the 10,000 limit to better follow
      // feathers pagination standards. You get better
      // performance when using $limit because stripe
      // will use Math.min($limit, 100) as the "chunk"
      // size for each page of autoPagingEach. When
      // no $limit is provided, it fallsback to a
      // page size of 10.
      const results = [];
      // console.time('pagination');
      await stripeMethod.autoPagingEach((result) => {
        results.push(result);
      });
      // console.timeEnd('pagination');
      return Promise.resolve(results);
    }
    throw new errors.MethodNotAllowed(
      'Cannot use paginate: false on this method'
    );
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
