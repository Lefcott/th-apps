/** @format */

import { Click } from '../interactions';

/**
 * List Filter component namespace
 *
 */
export const LF = {
  date: {
    selector: '#DSM_list-dateFilter',
  },
  destination: {
    selector: '#DSM_list-destinationFilter',
  },
  searchbar: {
    selector: '#DSM_list-searchbar',
  },
  sort: {
    selector: '#DSM_list-sortFilter',
    dateAsc: '[data-value="updatedAt:asc"]',
    dateDesc: '[data-value="updatedAt:desc"]',
    nameAsc: '[data-value="name:asc"]',
    nameDesc: '[data-value="name:desc"]',
  },
  noResultsMsg: '#DSM_noSearchResults',
};

/**
 * This abstracts the actions relating to the List Filter
 * @namespace ListFilter
 */
export default class ListFilter {
  /**
   * Method to filter to different audiences
   */
  static filterTo = () => {};
}
