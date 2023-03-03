/** @format */

import { Click } from '../interactions';
/**
 * More info panel component namespace
 *
 */
export const MIP = {
  panel: '#Rm_Panel-moreInfo',
  moveIn: 'input[name="moveInDate"]',
  moveInDate1:
    '#Rm_Panel-moreInfo-content > .rd-MuiAccordionDetails-root > .rd-MuiGrid-container > :nth-child(1) > .rd-MuiFormControl-root',
  moveInDate2:
    ':nth-child(1) > :nth-child(5) > :nth-child(3) > .rd-MuiButtonBase-root',
  oneMonthBack: '.rd-MuiPickersCalendarHeader-switchHeader > :nth-child(1)',
  datePicked:
    ':nth-child(2) > :nth-child(4) > .rd-MuiButtonBase-root > .rd-MuiIconButton-label > .rd-MuiTypography-root:first',
  movinOkBtn: ':nth-child(3) > .rd-MuiButton-label',
  residenceType: {
    dropdown: '#mui-component-select-residenceType',
    option: (o) => `[data-value="${o}"]`,
  },
};

/**
 * This abstracts the actions relating to the MoreInfoPanel
 * @namespace MoreInfoPanel
 */
export default class MoreInfoPanel {
  /**
   * Method to open the MoreInfoPanel
   */
  static open = () => Click.on(MIP.panel);

  /**
   * Method to changeResidenceType the MoreInfoPanel
   */
  static changeResidenceTypeTo = (resType) => {
    Click.on(MIP.residenceType.dropdown);
    Click.on(MIP.residenceType.option(resType));
  };
  static changeMoveInDate = () => {
    Click.on(MIP.panel);
    Click.on(MIP.moveInDate1);
    Click.on(MIP.oneMonthBack);
    Click.on(MIP.datePicked);
    Click.on(MIP.movinOkBtn);
  };
}
