import { expect } from 'vitest'
import {
  GeneralError,
  PaymentError,
  BadRequest,
  Unavailable,
  NotAuthenticated,
  Forbidden,
  TooManyRequests,
} from '@feathersjs/errors'
import { Stripe } from 'stripe'
import { AccountLinkService } from '../src/index.js'

describe('handleError', () => {
  // @ts-expect-error - we don't need stripe for this test
  const service = new AccountLinkService({ stripe: {} })

  describe('when it is a Stripe error', () => {
    it.each([
      [Stripe.errors.StripeCardError, PaymentError],
      [Stripe.errors.StripeInvalidRequestError, BadRequest],
      [Stripe.errors.StripeAPIError, Unavailable],
      [Stripe.errors.StripeConnectionError, Unavailable],
      [Stripe.errors.StripeAuthenticationError, NotAuthenticated],
      [Stripe.errors.StripePermissionError, Forbidden],
      [Stripe.errors.StripeRateLimitError, TooManyRequests],
      [Stripe.errors.StripeIdempotencyError, GeneralError],
    ])('maps %o to %o', (StripeErrorClass, FeathersError) => {
      const error = new StripeErrorClass({ message: 'Boom' })

      expect(() => service.handleError(error)).to.throw(FeathersError)
    })

    it('keeps the stripe error as data', () => {
      const error = new Stripe.errors.StripeCardError({
        message: 'Your card was declined.',
        code: 'card_declined',
      })

      try {
        service.handleError(error)
        expect.unreachable()
      } catch (e: any) {
        expect(e).to.be.instanceOf(PaymentError)
        expect(e.message).to.equal('Your card was declined.')
        expect(e.data.code).to.equal('card_declined')
      }
    })
  })

  describe('when it is not a Stripe error', () => {
    it('throws a GeneralError', () => {
      expect(() => service.handleError(new Error('Boom') as any)).to.throw(
        GeneralError,
      )
    })
  })
})
