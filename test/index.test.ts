import { expect } from 'vitest'
import * as index from '../src/index.js'

describe('feathers-stripe', () => {
  it('exports the expected services', () => {
    const services = Object.keys(index)
      .filter((key) => key.endsWith('Service'))
      .sort()

    expect(services).to.deep.equal([
      'AccountLinkService',
      'AccountService',
      'ApplicationFeeRefundService',
      'BalanceService',
      'BalanceTransactionService',
      'BankAccountService',
      'BillingMeterEventService',
      'BillingMeterService',
      'ChargeService',
      'CheckoutSessionService',
      'CouponService',
      'CreditNoteService',
      'CustomerPortalConfigurationService',
      'CustomerPortalSessionService',
      'CustomerService',
      'CustomerSessionService',
      'DisputeService',
      'EventService',
      'ExternalAccountService',
      'InvoiceItemService',
      'InvoiceService',
      'PaymentIntentService',
      'PaymentLinkService',
      'PaymentMethodService',
      'PayoutService',
      'PlanService',
      'PriceService',
      'ProductService',
      'PromotionCodeService',
      'RefundService',
      'SetupIntentService',
      'SourceService',
      'SubscriptionItemService',
      'SubscriptionScheduleService',
      'SubscriptionService',
      'TaxRateService',
      'TokenService',
      'TransferReversalService',
      'TransferService',
      'WebhookService',
    ])

    for (const name of services) {
      expect((index as any)[name], name).to.be.a('function')
    }
  })

  it('exports setupWebhook', () => {
    expect(index.setupWebhook).to.be.a('function')
  })
})
