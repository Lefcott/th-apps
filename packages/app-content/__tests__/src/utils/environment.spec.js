/** @format */

import { getUnfurlerUrl } from '../../../src/utils/environment';

const K4_ENV = process.env.K4_ENV;

describe('utils - environment', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env.K4_ENV = K4_ENV;
    delete process.env.REACT_APP_LOCAL_TOKEN;
  });

  it('should get correct environment url', () => {
    expect(getUnfurlerUrl()).toMatch(/\/test\/v1\/unfurl/);
  });
});
