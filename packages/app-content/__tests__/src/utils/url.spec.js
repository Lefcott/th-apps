/** @format */

import { getAllSearchParams, getOneSearchParam } from '../../../src/utils/url';

describe('utils - url', () => {
  const searchParams = '?communityId=2476&testParams=test';
  beforeEach(() => {
    global.window = Object.create(window);
    const url = 'http://dummy.com';
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
        search: searchParams,
      },
    });
  });

  it('should returns all search params', () => {
    expect(getAllSearchParams()).toMatchObject({
      communityId: '2476',
      testParams: 'test',
    });
  });

  it('should returns the target param value', () => {
    expect(getOneSearchParam('communityId')).toBe('2476');
  });

  it('should warn if ther is no matched param', () => {
    console.warn = jest.fn();
    getOneSearchParam('invalidParams');
    expect(console.warn).toHaveBeenCalled();
  });
});
