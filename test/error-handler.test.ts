import { expect } from "vitest";
import {
  GeneralError,
  PaymentError,
  BadRequest,
  Unavailable,
  NotAuthenticated
} from "@feathersjs/errors";
import Stripe from "stripe";
import { AccountLinkService } from "../src";

describe("handleError", () => {
  // @ts-expect-error - we don't need stripe for this test
  const service = new AccountLinkService({ stripe: {} });

  describe("when it is a Stripe error", () => {
    let error: Stripe.errors.StripeError;

    it("handles StripeCardError", () => {
      error = Stripe.errors.StripeError.generate({ type: "card_error" });

      expect(() => service.handleError(error)).to.throw(PaymentError);
    });

    it("handles StripeInvalidRequestError", () => {
      error = Stripe.errors.StripeError.generate({ type: "invalid_request_error" });

      expect(() => service.handleError(error)).to.throw(BadRequest);
    });

    it("handles StripeAPIError", () => {
      error = Stripe.errors.StripeError.generate({ type: "api_error" });

      expect(() => service.handleError(error)).to.throw(Unavailable);
    });

    it("handles StripeConnectionError", () => {
      error = new Stripe.errors.StripeConnectionError({ type: "api_error" });

      expect(() => service.handleError(error)).to.throw(Unavailable);
    });

    it("handles StripeAuthenticationError", () => {
      error = Stripe.errors.StripeError.generate({ type: "authentication_error" });

      expect(() => service.handleError(error)).to.throw(NotAuthenticated);
    });

    it("handles unknown Stripe errors", () => {
      error = Stripe.errors.StripeError.generate({ type: "Unknown" as Stripe.RawErrorType });

      expect(() => service.handleError(error)).to.throw(GeneralError);
    });
  });
});
