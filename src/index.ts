export { AccountService } from './services/account';
export { AccountLinkService } from './services/account-links';
export { ApplicationFeeRefundService } from './services/application-fee-refund';
export { BalanceService } from './services/balance';
export { BankAccountService } from './services/bank-account';
export { ExternalAccountService } from './services/external-account';
export { CardService } from './services/card';
export { ChargeService } from './services/charge';
export { CouponService } from './services/coupon';
export { CustomerService } from './services/customer';
export { DisputeService } from './services/dispute';
export { EventService } from './services/event';
export { InvoiceService } from './services/invoice';
export { InvoiceItemService } from './services/invoice-item';
export { OrderService } from './services/order';
export { PayoutService } from './services/payout';
export { PaymentIntentService } from './services/payment-intent';
export { PaymentMethodService } from './services/payment-method';
export { PlanService } from './services/plan';
export { PriceService } from './services/price';
export { ProductService } from './services/product';
export { RecipientService } from './services/recipient';
export { RefundService } from './services/refund';
export { SetupIntentService } from './services/setup-intent';
export { SkuService } from './services/sku';
export { SourceService } from './services/source';
export { SubscriptionService } from './services/subscription';
export { SubscriptionItemService } from './services/subscription-item';
export { TokenService } from './services/token';
export { TransactionService } from './services/transaction';
export { TransferService } from './services/transfer';
export { TransferReversalService } from './services/transfer-reversal';
import { Application } from '@feathersjs/feathers';
import { WebHookHandler, WebhookService } from './services/webhook';

type SetupWebHookOptions = {
  endpointSecret: string;
  secretKey: string;
  handlers: Record<string, WebHookHandler>;
}

function setupWebhook (app: Application, route: string, { endpointSecret, secretKey, handlers }) {
  app.use(route, new WebhookService({
    route,
    handlers,
    secretKey,
    app,
    endpointSecret
  }));
}

export { setupWebhook, WebhookService };
