import { expect } from "vitest";
import {
  GeneralError,
  PaymentError,
  BadRequest,
  Unavailable,
  NotAuthenticated
} from "@feathersjs/errors";
import { BaseService } from "../src/services/base";

describe("handleError", () => {
  const service = new BaseService({ stripe: {} });

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

      expect(() => service.handleError(error))
        .to.throw(GeneralError)
        .with.property("message")
        .that.equals("Unknown Payment Gateway Error");
    });
  });
});
