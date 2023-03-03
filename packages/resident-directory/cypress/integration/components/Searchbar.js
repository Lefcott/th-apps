/** @format */

import Verify from '../assertions/Verify';
import { Type } from '../interactions';

/**
 * Searchbar component namespace
 *
 */
export const SB = {
  selector: '#Rm_searchbar',
  backdrop: '.rd-MuiBackdrop-root',
  resultText: '[style="font-weight: 600;"].rd-MuiTypography-body1',
  residentsContainer: '.rd-teamhub-res-dir1',
};

/**
 * This abstracts the actions relating to the Searchbar
 * @namespace Searchbar
 */
export default class Searchbar {
  /**
   * Method to search for text
   */
  static searchFor = (searchText) => {
    Verify.theElement(SB.selector)
      .hasCSSProp('visibility')
      .withValue('visible'),
      Type.theText(searchText).into(SB.selector);
  };
}
