import { expect, vi } from "vitest";
import type Stripe from "stripe";
import { WebhookService, type WebHookHandler } from "../src";

const makeEvent = (type: string) =>
  ({ type, data: { object: { id: "obj_123" } } }) as unknown as Stripe.Event;

describe("WebhookService", () => {
  const app = {} as any;
  const stripe = {} as any;

  it("calls a handler with two levels", async () => {
    const created = vi.fn<WebHookHandler>().mockResolvedValue("created");
    const service = new WebhookService({
      app,
      stripe,
      handlers: { customer: { created } }
    });
    const event = makeEvent("customer.created");

    const result = await service.create(event, {});

    expect(result).to.equal("created");
    expect(created).toHaveBeenCalledWith({
      object: event.data.object,
      event,
      params: {},
      app
    });
  });

  it("calls a handler with three levels", async () => {
    const completed = vi.fn<WebHookHandler>().mockResolvedValue("completed");
    const service = new WebhookService({
      app,
      stripe,
      handlers: { checkout: { session: { completed } } }
    });

    const result = await service.create(
      makeEvent("checkout.session.completed"),
      {}
    );

    expect(result).to.equal("completed");
    expect(completed).toHaveBeenCalledOnce();
  });

  it("calls a handler with four levels", async () => {
    const created = vi.fn<WebHookHandler>().mockResolvedValue("created");
    const service = new WebhookService({
      app,
      stripe,
      handlers: { customer: { subscription: { trial_will_end: created } } }
    });

    const result = await service.create(
      makeEvent("customer.subscription.trial_will_end"),
      {}
    );

    expect(result).to.equal("created");
  });

  it("calls only the matching handler", async () => {
    const created = vi.fn<WebHookHandler>();
    const deleted = vi.fn<WebHookHandler>();
    const service = new WebhookService({
      app,
      stripe,
      handlers: { customer: { created, deleted } }
    });

    await service.create(makeEvent("customer.deleted"), {});

    expect(deleted).toHaveBeenCalledOnce();
    expect(created).not.toHaveBeenCalled();
  });

  it("resolves an empty object when no handler exists", async () => {
    const service = new WebhookService({
      app,
      stripe,
      handlers: { customer: { created: vi.fn<WebHookHandler>() } }
    });

    expect(await service.create(makeEvent("invoice.paid"), {})).to.deep.equal(
      {}
    );
    expect(
      await service.create(makeEvent("customer.updated"), {})
    ).to.deep.equal({});
  });

  it("resolves an empty object when the event only matches a namespace", async () => {
    const service = new WebhookService({
      app,
      stripe,
      handlers: { checkout: { session: { completed: vi.fn<WebHookHandler>() } } }
    });

    expect(
      await service.create(makeEvent("checkout.session"), {})
    ).to.deep.equal({});
  });

  it("requires an app", () => {
    expect(
      () => new WebhookService({ app: undefined, stripe, handlers: {} })
    ).to.throw("options.app is required");
  });
});

describe("WebhookService with synchronous handlers", () => {
  it("resolves the return value of a synchronous handler", async () => {
    const service = new WebhookService({
      app: {} as any,
      stripe: {} as any,
      handlers: { customer: { created: () => "sync" } }
    });

    expect(await service.create(makeEvent("customer.created"), {})).to.equal(
      "sync"
    );
  });
});
