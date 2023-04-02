import { expect } from "chai";
import {
  AccountService,
  AccountLinkService,
  ApplicationFeeRefundService,
  BalanceService,
  BankAccountService,
  ExternalAccountService,
  CardService,
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
  WebhookService
} from "../src";

const services = [
  AccountService,
  AccountLinkService,
  ApplicationFeeRefundService,
  BalanceService,
  BankAccountService,
  ExternalAccountService,
  CardService,
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
  WebhookService
];

describe("feathers-stripe", () => {
  it("exports expected classes", () => {
    services.forEach((Service) => {
      expect(Service).to.be.a("function");
    });
  });
});
