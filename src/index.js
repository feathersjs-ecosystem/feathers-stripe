import account from './services/account';
import balance from './services/balance';
import bankAccount from './services/bank-account';
import card from './services/card';
import charge from './services/charge';
import coupon from './services/coupon';
import customer from './services/customer';
import dispute from './services/dispute';
import event from './services/event';
import invoice from './services/invoice';
import invoiceItem from './services/invoice-item';
import order from './services/order';
import payout from './services/payout';
import plan from './services/plan';
import product from './services/product';
import recipient from './services/recipient';
import refund from './services/refund';
import sku from './services/sku';
import subscription from './services/subscription';
import token from './services/token';
import transaction from './services/transaction';
import transfer from './services/transfer';
import transferReversal from './services/transfer-reversal';

if (!global._babelPolyfill) { require('babel-polyfill'); }

export default {
  account,
  balance,
  bankAccount,
  card,
  charge,
  coupon,
  customer,
  dispute,
  event,
  invoice,
  invoiceItem,
  order,
  payout,
  plan,
  product,
  recipient,
  refund,
  sku,
  subscription,
  token,
  transaction,
  transfer,
  transferReversal
};
