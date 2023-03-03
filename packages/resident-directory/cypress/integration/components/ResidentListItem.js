/** @format */

import { Click } from '../interactions';

/**
 * Resident list item component namespace
 *
 * @prop {string} listItem the selector for the whole resident list item component
 * @prop {string} name the selector for the name in the resident list item component
 * @prop {string} address the selector for the address in the resident list item component
 * @prop {string} movePending the selector for the move pending indicator in the resident list item component
 * @prop {object} options
 * @prop {string} options.selector the selector for the options selector in the resident list item component
 * @prop {string} options.residentMove the selector for the resident move option in the resident list item component more list
 * @prop {string} options.getAppCode the selector for the get app code option in the resident list item component more list
 */
export const RLI = {
  loader: 'svg[aria-label="Loading interface..."]',
  listItem: '.Rm_resident-listItem',
  name: '.Rm_resident-listItem-name',
  named: (name) => `.Rm_resident-listItem-name:contains("${name}")`,
  address: '.Rm_resident-listItem-address',
  movePending: '.Rm_resident-listItem-movePending',
  firstResOptions:
    '.rd-MuiListItem-root:first.rd-MuiButtonBase-root .rd-MuiIconButton-root',
  getAppCode: '.rd-MuiList-root > .rd-MuiButtonBase-root',
  residentMove: '.Rm_resident-listItem-options-residentMove',
};

/**
 * This abstracts the actions relating to the ResidentListItem
 * @namespace ResidentListItem
 */
export default class ResidentListItem {
  /**
   * Method to select the first residentListItem
   */
  static getFirst = () => Click.onFirst(RLI.listItem);

  /**
   * Method to select the a residentListItem with a resident named
   */
  static selectTheOneNamed = (residentName) =>
    Click.on(RLI.named(residentName));

  /**
   * Method to get an app code for a resident
   */
  static getAppCode = () => ({
    forFirstResident: () => Click.on(RLI.listItem),
    forResidentNamed: (residentName) => Click.on(RLI.named(residentName)),
  });
}
