/** @format */

import { setDomain, getPlaceholderImg } from '../../../src/utils/hooks';
import DesignPlaceholder from '../../../src/utils/images/DesignPlaceholder.svg';
import PhotoPlaceholder from '../../../src/utils/images/PhotoPlaceholder.svg';
import PdfPlaceholder from '../../../src/utils/images/PdfPlaceholder.svg';

describe('utils - hooks', () => {
  it('should set the correct k4connect domain', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://k4connect',
      },
    });

    setDomain();
    expect(document.domain).toMatch(/k4connect.com/);
  });

  it('should display correct place holder image', () => {
    expect(getPlaceholderImg('design')).toBe(DesignPlaceholder);
    expect(getPlaceholderImg('photo')).toBe(PhotoPlaceholder);
    expect(getPlaceholderImg('document')).toBe(PdfPlaceholder);
  });
});
