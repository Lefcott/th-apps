/** @format */

import { Type } from '../interactions';

/**
 * Searchbar component namespace
 *
 */
export const AAM = {
  title: '.rd-MuiDialogTitle-root > .rd-MuiTypography-root',
  content1: '.rd-MuiDialogContent-root > :nth-child(1)',
  content2: '.rd-MuiDialogContent-root > :nth-child(2)',
  supportPageLink:
    '.rd-MuiDialogContent-root > :nth-child(2) > .rd-MuiTypography-root',
  code: '.rd-MuiTypography-h2',
  doneBtn: '.rd-MuiDialogActions-root > .rd-MuiButtonBase-root',
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
