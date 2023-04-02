import type Stripe from "stripe";
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from "../types";
import { BaseService } from "./base";

export interface IInvoiceItemService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.InvoiceItemListParams>, Stripe.InvoiceItem>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.InvoiceItem>;
  _create(data: Stripe.InvoiceItemCreateParams, params: ParamsWithStripe): Promise<Stripe.InvoiceItem>;
  _update: (id: string, data: Stripe.InvoiceItemUpdateParams, params: ParamsWithStripe) => Promise<Stripe.InvoiceItem>;
  _patch: (id: string, data: Stripe.InvoiceItemUpdateParams, params: ParamsWithStripe) => Promise<Stripe.InvoiceItem>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.DeletedInvoiceItem>;
}

export class InvoiceItemService extends BaseService<IInvoiceItemService> implements IInvoiceItemService {
  _find (params: ParamsWithStripeQuery<Stripe.InvoiceItemListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.invoiceItems.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoiceItems.retrieve(id, stripe);
  }

  _create (data: Stripe.InvoiceItemCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoiceItems.create(data, stripe);
  }

  _update (id: string, data: Stripe.InvoiceUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoiceItems.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.InvoiceItemUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.invoiceItems.del(id, stripe);
  }
}
