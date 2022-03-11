const { expect } = require('chai');

const { normalizeQuery } = require('../lib/normalize-query');

describe('normalizeQuery', () => {
  describe('when $limit is present', () => {
    const params = {
      customer: 1,
      query: {
        $limit: 5,
        name: 'bob'
      }
    };

    it('replaces $limit with limit', () => {
      const query = normalizeQuery(params);
      expect(query.$limit).to.equal(undefined);
      expect(query.limit).to.equal(5);
    });

    it('does not modify original params', () => {
      const paramsCopy = Object.assign({}, params);
      normalizeQuery(params);
      expect(params).to.deep.equal(paramsCopy);
    });

    it('returns original query object params', () => {
      const query = normalizeQuery(params);
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
      const query = normalizeQuery(params);
      expect(query).to.deep.equal({ name: 'bob' });
    });
  });
});
