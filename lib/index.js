const Account = require('./services/account');
const AccountLinks = require('./services/account-links');
const Balance = require('./services/balance');
const BankAccount = require('./services/bank-account');
const ExternalAccount = require('./services/external-account');
const Card = require('./services/card');
const Charge = require('./services/charge');
const Coupon = require('./services/coupon');
const Customer = require('./services/customer');
const Dispute = require('./services/dispute');
const Event = require('./services/event');
const Invoice = require('./services/invoice');
const InvoiceItem = require('./services/invoice-item');
const Order = require('./services/order');
const Payout = require('./services/payout');
const PaymentIntent = require('./services/payment-intent');
const PaymentMethod = require('./services/payment-method');
const Plan = require('./services/plan');
const Product = require('./services/product');
const Recipient = require('./services/recipient');
const Refund = require('./services/refund');
const SetupIntent = require('./services/setup-intent');
const Sku = require('./services/sku');
const Source = require('./services/source');
const Subscription = require('./services/subscription');
const SubscriptionItem = require('./services/subscription-item');
const Token = require('./services/token');
const Transaction = require('./services/transaction');
const Transfer = require('./services/transfer');
const TransferReversal = require('./services/transfer-reversal');
const Webhook = require('./services/webhook');

function setupWebhook (app, route, { endpointSecret, secretKey, handlers }) {
  app.use(route, new Webhook({
    route,
    handlers,
    secretKey,
    app,
    endpointSecret
  }));
}

module.exports = {
  Account,
  AccountLinks,
  Balance,
  BankAccount,
  ExternalAccount,
  Card,
  Charge,
  Coupon,
  Customer,
  Dispute,
  Event,
  Invoice,
  InvoiceItem,
  Order,
  PaymentIntent,
  PaymentMethod,
  Payout,
  Plan,
  Product,
  Recipient,
  Refund,
  SetupIntent,
  Sku,
  Source,
  Subscription,
  SubscriptionItem,
  Token,
  Transaction,
  Transfer,
  TransferReversal,
  Webhook,
  setupWebhook
};
