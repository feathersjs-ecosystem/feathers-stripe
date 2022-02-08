const { expect } = require('chai');
const stripe = require('../lib');

const CLASSES = ['Account',
  'Balance',
  'ExternalAccount',
  'BankAccount',
  'Card',
  'Charge',
  'Coupon',
  'Customer',
  'Dispute',
  'Event',
  'Invoice',
  'InvoiceItem',
  'Order',
  'Payout',
  'Plan',
  'Product',
  'Recipient',
  'Refund',
  'Sku',
  'Subscription',
  'SubscriptionItem',
  'Token',
  'Transaction',
  'Transfer',
  'TransferReversal',
  'Webhook',
  'setupWebhook'
];

describe('feathers-stripe', () => {
  it('exports expected classes', () => {
    CLASSES.forEach(name => {
      expect(typeof stripe[name]).to.equal('function');
    });
  });
});
