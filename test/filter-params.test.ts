import { expect, expectTypeOf } from "vitest";
import { AccountLinkService } from "../src";
import { BaseService } from "../src/services/base";

describe("filterQuery", () => {
  // @ts-expect-error - we don't need stripe for this test
  const service = new AccountLinkService({ stripe: {} });

  describe("when $limit is present", () => {
    const params = {
      customer: 1,
      query: {
        $limit: 5,
        name: "bob"
      }
    };

    it("replaces $limit with limit", () => {
      const query = service.filterQuery(params);
      expectTypeOf(query).toEqualTypeOf<{ limit: number; name: string }>();
      expectTypeOf(query).not.toHaveProperty("$limit");
      // @ts-expect-error $limit should not exits anymore on this type
      expect(query.$limit).to.equal(undefined);
      expect(query.limit).to.equal(5);
    });

    it("does not modify original params", () => {
      const paramsCopy = Object.assign({}, params);
      service.filterQuery(params);
      expect(params).to.deep.equal(paramsCopy);
    });

    it("returns original query object params", () => {
      const query = service.filterQuery(params);
      expectTypeOf(query).toEqualTypeOf<{ limit: number; name: string }>();
      expect(query.name).to.equal("bob");
    });
  });

  describe("when $limit is not present", () => {
    it("returns original query object", () => {
      const params = {
        customer: 1,
        query: {
          name: "bob"
        }
      };
      const query = service.filterQuery(params);
      expectTypeOf(query).toEqualTypeOf<{ name: string }>();
      expect(query).to.deep.equal({ name: "bob" });
    });
  });
});

describe("filterParams", () => {
  abstract class TestService extends BaseService<any> {
    _create(data: any, params: any) {
      return this.filterParams(params);
    }
  }
  // @ts-expect-error - we don't need stripe for this test
  const service = new TestService({ stripe: {} });

  describe("when params are not present", () => {
    const params: undefined = undefined;

    it("returns empty values", () => {
      expect(() => service.filterParams(params)).to.throw();
    });
  });

  describe("when stripe is present", () => {
    const params = {
      stripe: {
        expand: ["customer"]
      }
    };

    it("picks off stripe", () => {
      const { stripe } = service.filterParams(params as any);
      expect(stripe).to.deep.equal(params.stripe);
    });
  });

  describe("when stripe is not present", () => {
    it("returns empty object", () => {
      const params = {};
      const { stripe } = service.filterParams(params);
      expect(stripe).to.deep.equal(undefined);
    });
  });
});

describe("cleanQuery", () => {
  // @ts-expect-error - we don't need stripe for this test
  const service = new AccountLinkService({ stripe: {} });

  describe("when $ keys are present", () => {
    const query = {
      prop: { $gt: Date.now() },
      nested: { nested: { $gt: Date.now() } },
      array: [{ $lt: Date.now() }]
    };

    const expected = {
      prop: { gt: Date.now() },
      nested: { nested: { gt: Date.now() } },
      array: [{ lt: Date.now() }]
    };

    it("strips keys that start with $", () => {
      const cleanQuery = service.cleanQuery(query);
      expectTypeOf(cleanQuery).toEqualTypeOf<typeof expected>();
      expect(cleanQuery).to.deep.equal(expected);
    });
  });

  describe("when $ keys are not present", () => {
    const query = {
      prop: { gt: Date.now() },
      nested: { nested: { gt: Date.now() } },
      array: [{ lt: Date.now() }]
    };

    it("does not modify orignal keys", () => {
      const cleanQuery = service.cleanQuery(query);
      expectTypeOf(cleanQuery).toEqualTypeOf<typeof query>();
      expect(cleanQuery).to.deep.equal(query);
    });
  });
});
