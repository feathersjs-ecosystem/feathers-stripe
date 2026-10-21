import { expect, vi } from "vitest";
import { MethodNotAllowed } from "@feathersjs/errors";
import { CustomerService } from "../src";

const customers = [{ id: "cus_1" }, { id: "cus_2" }, { id: "cus_3" }];
const page = { object: "list", data: customers.slice(0, 2), has_more: true };

const makeListPromise = () =>
  Object.assign(Promise.resolve(page), {
    autoPagingEach: vi.fn(async (cb: (item: any) => void) => {
      customers.forEach(cb);
    })
  });

describe("handlePaginate", () => {
  // @ts-expect-error - we don't need stripe for this test
  const service = new CustomerService({ stripe: {} });

  it("returns the stripe list when paginate is not false", async () => {
    const listPromise = makeListPromise();
    const result = await service.handlePaginate(
      service.filterParams({}),
      listPromise as any
    );

    expect(result).to.deep.equal(page);
    expect(listPromise.autoPagingEach).not.toHaveBeenCalled();
  });

  it("collects all pages when paginate is false", async () => {
    const listPromise = makeListPromise();
    const result = await service.handlePaginate(
      service.filterParams({ paginate: false }),
      listPromise as any
    );

    expect(result).to.deep.equal(customers);
    expect(listPromise.autoPagingEach).toHaveBeenCalledOnce();
  });

  it("throws when paginate is false and the method cannot auto paginate", async () => {
    await expect(
      service.handlePaginate(
        service.filterParams({ paginate: false }),
        Promise.resolve(page) as any
      )
    ).rejects.toThrow(MethodNotAllowed);
  });
});

describe("find with paginate", () => {
  const list = vi.fn(() => makeListPromise());
  const service = new CustomerService({ stripe: { customers: { list } } as any });

  beforeEach(() => vi.clearAllMocks());

  it("passes $limit through as limit", async () => {
    await service.find({ query: { $limit: 50 } as any });

    expect(list).toHaveBeenCalledWith({ limit: 50 }, undefined);
  });

  it("does not add a default limit", async () => {
    await service.find({ query: {} });

    expect(list).toHaveBeenCalledWith({}, undefined);
  });

  it("returns all items with paginate: false", async () => {
    const result = await service.find({ query: {}, paginate: false });

    expect(result).to.deep.equal(customers);
  });
});
