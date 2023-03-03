/** @format */

import { Type } from '../../interactions';
import SearchBarElements from '../page-elements/search-bar';
/**
 * This abstracts the actions relating to the Searchbar
 * @namespace Searchbar
 */
export default class Searchbar {
  /**
   * Method to search for text
   */
  static searchFor = (searchText) =>
    Type.theText(searchText).into(SearchBarElements.toolbarSearch);
}
