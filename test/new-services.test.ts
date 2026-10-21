import { expect, vi } from "vitest";
import { NotImplemented } from "@feathersjs/errors";
import {
  CheckoutSessionService,
  CustomerPortalConfigurationService,
  CustomerPortalSessionService
} from "../src";

const list = { object: "list", data: [{ id: "item_1" }], has_more: false };
const requestOptions = { stripeAccount: "acct_123" };

describe("CheckoutSessionService", () => {
  const sessions = {
    list: vi.fn().mockResolvedValue(list),
    retrieve: vi.fn().mockResolvedValue({ id: "cs_123" }),
    create: vi.fn().mockResolvedValue({ id: "cs_123" }),
    update: vi.fn().mockResolvedValue({ id: "cs_123" }),
    expire: vi.fn().mockResolvedValue({ id: "cs_123", status: "expired" })
  };
  const service = new CheckoutSessionService({
    stripe: { checkout: { sessions } } as any
  });

  beforeEach(() => vi.clearAllMocks());

  it("find calls checkout.sessions.list with cleaned query", async () => {
    const result = await service.find({
      query: { $limit: 5, customer: "cus_123" } as any,
      stripe: requestOptions
    });

    expect(result).to.deep.equal(list);
    expect(sessions.list).toHaveBeenCalledWith(
      { limit: 5, customer: "cus_123" },
      requestOptions
    );
  });

  it("get calls checkout.sessions.retrieve", async () => {
    await service.get("cs_123", { stripe: requestOptions });

    expect(sessions.retrieve).toHaveBeenCalledWith("cs_123", requestOptions);
  });

  it("create calls checkout.sessions.create", async () => {
    const data = { mode: "payment" as const, success_url: "https://x.test" };
    await service.create(data, { stripe: requestOptions });

    expect(sessions.create).toHaveBeenCalledWith(data, requestOptions);
  });

  it("update calls checkout.sessions.update", async () => {
    const data = { metadata: { foo: "bar" } };
    await service.update("cs_123", data, { stripe: requestOptions });

    expect(sessions.update).toHaveBeenCalledWith(
      "cs_123",
      data,
      requestOptions
    );
  });

  it("remove expires the session", async () => {
    const result = await service.remove("cs_123", { stripe: requestOptions });

    expect(result).to.deep.equal({ id: "cs_123", status: "expired" });
    expect(sessions.expire).toHaveBeenCalledWith("cs_123", requestOptions);
  });

  it("patch is not implemented", () => {
    // @ts-expect-error - patch is not available on this service
    expect(() => service.patch("cs_123", {}, {})).to.throw(NotImplemented);
  });
});

describe("CustomerPortalConfigurationService", () => {
  const configurations = {
    list: vi.fn().mockResolvedValue(list),
    retrieve: vi.fn().mockResolvedValue({ id: "bpc_123" }),
    create: vi.fn().mockResolvedValue({ id: "bpc_123" }),
    update: vi.fn().mockResolvedValue({ id: "bpc_123" })
  };
  const service = new CustomerPortalConfigurationService({
    stripe: { billingPortal: { configurations } } as any
  });

  beforeEach(() => vi.clearAllMocks());

  it("find calls billingPortal.configurations.list", async () => {
    const result = await service.find({
      query: { active: true },
      stripe: requestOptions
    });

    expect(result).to.deep.equal(list);
    expect(configurations.list).toHaveBeenCalledWith(
      { active: true },
      requestOptions
    );
  });

  it("get calls billingPortal.configurations.retrieve", async () => {
    await service.get("bpc_123", { stripe: requestOptions });

    expect(configurations.retrieve).toHaveBeenCalledWith(
      "bpc_123",
      requestOptions
    );
  });

  it("create calls billingPortal.configurations.create", async () => {
    const data = { features: {} };
    await service.create(data, { stripe: requestOptions });

    expect(configurations.create).toHaveBeenCalledWith(data, requestOptions);
  });

  it("update calls billingPortal.configurations.update", async () => {
    const data = { active: false };
    await service.update("bpc_123", data, { stripe: requestOptions });

    expect(configurations.update).toHaveBeenCalledWith(
      "bpc_123",
      data,
      requestOptions
    );
  });

  it("patch calls billingPortal.configurations.update", async () => {
    const data = { active: false };
    await service.patch("bpc_123", data, { stripe: requestOptions });

    expect(configurations.update).toHaveBeenCalledWith(
      "bpc_123",
      data,
      requestOptions
    );
  });

  it("remove is not implemented", () => {
    // @ts-expect-error - remove is not available on this service
    expect(() => service.remove("bpc_123", {})).to.throw(NotImplemented);
  });
});

describe("CustomerPortalSessionService", () => {
  const sessions = {
    create: vi.fn().mockResolvedValue({ id: "bps_123", url: "https://x.test" })
  };
  const service = new CustomerPortalSessionService({
    stripe: { billingPortal: { sessions } } as any
  });

  it("create calls billingPortal.sessions.create", async () => {
    const data = { customer: "cus_123" };
    const result = await service.create(data, { stripe: requestOptions });

    expect(result).to.deep.equal({ id: "bps_123", url: "https://x.test" });
    expect(sessions.create).toHaveBeenCalledWith(data, requestOptions);
  });

  it("other methods are not implemented", () => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore - not available on this service
    expect(() => service.find({})).to.throw(NotImplemented);
    // @ts-ignore - not available on this service
    expect(() => service.get("bps_123", {})).to.throw(NotImplemented);
    // @ts-ignore - not available on this service
    expect(() => service.update("bps_123", {}, {})).to.throw(NotImplemented);
    // @ts-ignore - not available on this service
    expect(() => service.patch("bps_123", {}, {})).to.throw(NotImplemented);
    // @ts-ignore - not available on this service
    expect(() => service.remove("bps_123", {})).to.throw(NotImplemented);
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  });
});
