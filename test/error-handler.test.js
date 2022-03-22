const { expect } = require('chai');
const errors = require('@feathersjs/errors');
const Base = require('../lib/services/base');

describe('handleError', () => {

  const service = new Base({ stripe: {} });

  describe('when it is not a Stripe error', () => {
    it('returns original error', () => {
      return service.handleError(new Error('Normal Error')).catch(e => {
        expect(e instanceof Error).to.equal(true);
        expect(e.message).to.equal('Normal Error');
      });
    });
  });

  describe('when it is a Stripe error', () => {
    let error;

    beforeEach(() => (error = new Error('Stripe Error')));

    it('handles StripeCardError', () => {
      error.type = 'StripeCardError';

      return service.handleError(error).catch(e => {
        expect(e instanceof errors.PaymentError).to.equal(true);
      });
    });

    it('handles StripeInvalidRequestError', () => {
      error.type = 'StripeInvalidRequestError';

      return service.handleError(error).catch(e => {
        expect(e instanceof errors.BadRequest).to.equal(true);
      });
    });

    it('handles StripeInvalidRequest', () => {
      error.type = 'StripeInvalidRequest';

      return service.handleError(error).catch(e => {
        expect(e instanceof errors.BadRequest).to.equal(true);
      });
    });

    it('handles StripeAPIError', () => {
      error.type = 'StripeAPIError';

      return service.handleError(error).catch(e => {
        expect(e instanceof errors.Unavailable).to.equal(true);
      });
    });

    it('handles StripeConnectionError', () => {
      error.type = 'StripeConnectionError';

      return service.handleError(error).catch(e => {
        expect(e instanceof errors.Unavailable).to.equal(true);
      });
    });

    it('handles StripeAuthenticationError', () => {
      error.type = 'StripeAuthenticationError';

      return service.handleError(error).catch(e => {
        expect(e instanceof errors.NotAuthenticated).to.equal(true);
      });
    });

    it('handles unknown Stripe errors', () => {
      error.type = 'Unknown';

      return service.handleError(error).catch(e => {
        expect(e instanceof errors.GeneralError).to.equal(true);
        expect(e.message).to.equal('Unknown Payment Gateway Error');
      });
    });
  });
});
