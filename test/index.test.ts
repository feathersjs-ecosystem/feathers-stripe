import { expect } from "vitest";
import {
  AccountService,
  AccountLinkService,
  ApplicationFeeRefundService,
  BalanceService,
  BalanceTransactionService,
  BankAccountService,
  ExternalAccountService,
  ChargeService,
  CouponService,
  CustomerService,
  DisputeService,
  EventService,
  PaymentIntentService,
  PaymentMethodService,
  InvoiceService,
  InvoiceItemService,
  PayoutService,
  PlanService,
  PriceService,
  ProductService,
  RefundService,
  SetupIntentService,
  SourceService,
  SubscriptionService,
  SubscriptionItemService,
  TokenService,
  TransactionService,
  TransferService,
  TransferReversalService,
  WebhookService,
  CheckoutSessionService,
  CustomerPortalConfigurationService,
  CustomerPortalSessionService
} from "../src";

const services = [
  AccountService,
  AccountLinkService,
  ApplicationFeeRefundService,
  BalanceService,
  BalanceTransactionService,
  BankAccountService,
  ExternalAccountService,
  ChargeService,
  CouponService,
  CustomerService,
  DisputeService,
  EventService,
  PaymentIntentService,
  PaymentMethodService,
  InvoiceService,
  InvoiceItemService,
  PayoutService,
  PlanService,
  PriceService,
  ProductService,
  RefundService,
  SetupIntentService,
  SourceService,
  SubscriptionService,
  SubscriptionItemService,
  TokenService,
  TransactionService,
  TransferService,
  TransferReversalService,
  WebhookService,
  CheckoutSessionService,
  CustomerPortalConfigurationService,
  CustomerPortalSessionService
];

describe("feathers-stripe", () => {
  it("exports expected classes", () => {
    services.forEach((Service) => {
      expect(Service).to.be.a("function");
    });
  });
});
