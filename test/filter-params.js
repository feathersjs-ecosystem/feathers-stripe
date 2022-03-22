const { expect } = require('chai');
const Base = require('../lib/services/base');

describe('filterQuery', () => {

  const service = new Base({ stripe: {} });

  describe('when $limit is present', () => {
    const params = {
      customer: 1,
      query: {
        $limit: 5,
        name: 'bob'
      }
    };

    it('replaces $limit with limit', () => {
      const query = service.filterQuery(params);
      expect(query.$limit).to.equal(undefined);
      expect(query.limit).to.equal(5);
    });

    it('does not modify original params', () => {
      const paramsCopy = Object.assign({}, params);
      service.filterQuery(params);
      expect(params).to.deep.equal(paramsCopy);
    });

    it('returns original query object params', () => {
      const query = service.filterQuery(params);
      expect(query.name).to.equal('bob');
    });
  });

  describe('when $limit is not present', () => {
    it('returns original query object', () => {
      const params = {
        customer: 1,
        query: {
          name: 'bob'
        }
      };
      const query = service.filterQuery(params);
      expect(query).to.deep.equal({ name: 'bob' });
    });
  });
});

describe('filterParams', () => {

  const service = new Base({ stripe: {} });

  describe('when params are not present', () => {
    const params = undefined;

    it('returns empty objects', () => {
      const { stripe, query } = service.filterParams(params);
      expect(stripe).to.deep.equal({});
      expect(query).to.deep.equal({});
    });
  });

  describe('when stripe is present', () => {
    const params = {
      stripe: {
        expand: ['customer']
      }
    };

    it('picks off stripe', () => {
      const { stripe } = service.filterParams(params);
      expect(stripe).to.deep.equal(params.stripe);
    });
  });

  describe('when stripe is not present', () => {
    it('returns empty object', () => {
      const params = {};
      const { stripe } = service.filterParams(params);
      expect(stripe).to.deep.equal({});
    });
  });
});
