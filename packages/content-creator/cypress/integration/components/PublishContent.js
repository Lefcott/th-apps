import { Click, Type } from '../interactions';

/**
 * Publish content component namespace
 * @prop {string} btn the selector for the Publish content Button
 *
 */
export const PC = {
  dropdown: `#CR_Publish contentBtn`,
  signage: `#CR_publishDropdown-signage`,
  app: `CR_publishDropdown-app`,
  print: `CR_publishDropdown-print`,
};

/**
 * This abstracts the actions relating to publishing content
 * @namespace Publish content
 */
export default class PublishContent {
  /**
   * Method to Publish content to the app
   */
  static publishToApp = () => {
    cy.get(PC.dropdown).trigger('mouseover');
    Click.on(PC.app);
  }

  /**
   * Method to Publish content to digital signage
   */
  static publishToSignage = () => {
    cy.get(PC.dropdown).trigger('mouseover');
    Click.on(PC.signage);
  }

  /**
   * Method to Publish content to "Print"
   */
  static print = () => {
    cy.get(PC.dropdown).trigger('mouseover');
    Click.on(PC.print);
  }
}

