import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IInvoiceService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.Invoice[]>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Invoice>;
  _create: (data: Stripe.InvoiceCreateParams, params: ParamsWithStripe) => Promise<Stripe.Invoice>;
  _update: (id: string, data: Stripe.InvoiceUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Invoice>;
  _patch:
    ((id: string, data: { pay: boolean } & Stripe.InvoicePayParams, params: ParamsWithStripe) => Promise<Stripe.Invoice>) |
    ((id: string, data: Stripe.InvoiceUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Invoice>);
  _remove: never;
}

export class InvoiceService extends BaseService<IInvoiceService> implements IInvoiceService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.invoices.list(filtered.query, filtered.stripe)
    );
  }

  // TODO (EK): Support upcoming invoices
  // TODO (EK): Support invoice line items
  _get (id, params) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoices.retrieve(id, stripe);
  }

  _create (data: Stripe.InvoiceCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoices.create(data, stripe);
  }

  _update (id: string, data: Stripe.InvoiceUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoices.update(id, data, stripe);
  }

  _patch (id: string, data: { pay: boolean } & Stripe.InvoicePayParams, params: ParamsWithStripe)
  _patch (id: string, data: Stripe.InvoiceUpdateParams, params: ParamsWithStripe)
  _patch (id: string, data: ({ pay: boolean } & Stripe.InvoicePayParams) | Stripe.InvoiceUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    if ("pay" in data) {
      const { pay, ...rest } = data;
      if (pay) {
        return this.stripe.invoices.pay(id, stripe);
      }
    }

    return this._update(id, data, params);
  }

  _remove: never
};
