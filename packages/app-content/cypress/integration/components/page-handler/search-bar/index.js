/** @format */

import { Type } from '../../../interactions';
import SearchBarElements from '../../page-elements/search-bar/elements';

export default class Searchbar {
  /**
   * Method to search for text
   */
  static searchFor = (searchText) => {
    cy.wait(1000);
    Type.theText(searchText).into(SearchBarElements.selector);
    cy.wait(1000);
  };
}
