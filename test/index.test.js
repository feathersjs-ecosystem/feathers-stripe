import { expect } from 'chai';
import stripe from '../src';

describe('feathers-stripe', () => {
  it.skip('is CommonJS compatible', () => {
    expect(typeof require('../lib')).to.equal('object');
  });

  it('es2015 compatible', () => {
    expect(typeof stripe).to.equal('object');
  });

  it('supports accounts', () => {
    expect(typeof stripe.account).to.equal('function');
  });

  it('supports balances', () => {
    expect(typeof stripe.balance).to.equal('function');
  });

  it('supports bankAccounts', () => {
    expect(typeof stripe.bankAccount).to.equal('function');
  });

  it('supports cards', () => {
    expect(typeof stripe.card).to.equal('function');
  });

  it('supports charges', () => {
    expect(typeof stripe.charge).to.equal('function');
  });

  it('supports coupons', () => {
    expect(typeof stripe.coupon).to.equal('function');
  });

  it('supports customers', () => {
    expect(typeof stripe.customer).to.equal('function');
  });

  it('supports disputes', () => {
    expect(typeof stripe.dispute).to.equal('function');
  });

  it('supports events', () => {
    expect(typeof stripe.event).to.equal('function');
  });

  it('supports external accounts', () => {
    expect(typeof stripe.externalAccount).to.equal('function');
  });

  it('supports invoiceItems', () => {
    expect(typeof stripe.invoiceItem).to.equal('function');
  });

  it('supports invoices', () => {
    expect(typeof stripe.invoice).to.equal('function');
  });

  it('supports orders', () => {
    expect(typeof stripe.order).to.equal('function');
  });

  it('supports payouts', () => {
    expect(typeof stripe.payout).to.equal('function');
  });

  it('supports plans', () => {
    expect(typeof stripe.plan).to.equal('function');
  });

  it('supports products', () => {
    expect(typeof stripe.product).to.equal('function');
  });

  it('supports recipients', () => {
    expect(typeof stripe.recipient).to.equal('function');
  });

  it('supports refunds', () => {
    expect(typeof stripe.refund).to.equal('function');
  });

  it('supports skus', () => {
    expect(typeof stripe.sku).to.equal('function');
  });

  it('supports subscriptions', () => {
    expect(typeof stripe.subscription).to.equal('function');
  });

  it('supports tokens', () => {
    expect(typeof stripe.token).to.equal('function');
  });

  it('supports transactions', () => {
    expect(typeof stripe.transaction).to.equal('function');
  });

  it('supports transfers', () => {
    expect(typeof stripe.transfer).to.equal('function');
  });

  it('supports transferReversals', () => {
    expect(typeof stripe.transferReversal).to.equal('function');
  });
});
