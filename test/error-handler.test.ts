import { expect } from "vitest";
import {
  GeneralError,
  PaymentError,
  BadRequest,
  Unavailable,
  NotAuthenticated
} from "@feathersjs/errors";
import { AccountLinkService } from "../src";

describe("handleError", () => {
  // @ts-expect-error - we don't need stripe for this test
  const service = new AccountLinkService({ stripe: {} });

  describe("when it is a Stripe error", () => {
    let error;

    beforeEach(() => (error = new Error("Stripe Error")));

    it("handles StripeCardError", () => {
      error.type = "StripeCardError";

      expect(() => service.handleError(error)).to.throw(PaymentError);
    });

    it("handles StripeInvalidRequestError", () => {
      error.type = "StripeInvalidRequestError";

      expect(() => service.handleError(error)).to.throw(BadRequest);
    });

    it("handles StripeAPIError", () => {
      error.type = "StripeAPIError";

      expect(() => service.handleError(error)).to.throw(Unavailable);
    });

    it("handles StripeConnectionError", () => {
      error.type = "StripeConnectionError";

      expect(() => service.handleError(error)).to.throw(Unavailable);
    });

    it("handles StripeAuthenticationError", () => {
      error.type = "StripeAuthenticationError";

      expect(() => service.handleError(error)).to.throw(NotAuthenticated);
    });

    it("handles unknown Stripe errors", () => {
      error.type = "Unknown";

      expect(() => service.handleError(error)).to.throw(GeneralError);
    });
  });
});
