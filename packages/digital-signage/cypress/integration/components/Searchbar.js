/** @format */

import { Type } from '../interactions';

/**
 * Searchbar component namespace
 *
 */
export const SB = {
  selector: '#AP_nametag-search',
};

/**
 * This abstracts the actions relating to the Searchbar
 * @namespace Searchbar
 */
export default class Searchbar {
  /**
   * Method to search for text
   */
  static searchFor = (searchText) => Type.theText(searchText).into(SB.selector);
}
