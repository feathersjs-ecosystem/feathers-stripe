import { expect } from 'chai';
import * as stripe from '../src';

const CLASSES = [
  'AccountService',
  'BalanceService',
  'ExternalAccountService',
  'BankAccountService',
  'CardService',
  'ChargeService',
  'CouponService',
  'CustomerService',
  'DisputeService',
  'EventService',
  'InvoiceService',
  'InvoiceItemService',
  'OrderService',
  'PayoutService',
  'PlanService',
  'PriceService',
  'ProductService',
  'RefundService',
  'SkuService',
  'SubscriptionService',
  'SubscriptionItemService',
  'TokenService',
  'TransactionService',
  'TransferService',
  'TransferReversalService',
  'WebhookService',
  'setupWebhookService'
];

describe('feathers-stripe', () => {
  it('exports expected classes', () => {
    CLASSES.forEach(name => {
      expect(typeof stripe[name]).to.equal('function');
    });
  });
});
