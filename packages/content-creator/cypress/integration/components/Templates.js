import { Click, Type } from '../interactions';

/**
 * Template component namespace
 * @prop {string} btn the selector for the Slide Templates Button
 *
 */
export const TP = {
  btn: `#CR_templatesBtn`,
  birthdayTemplates: `Button:contains("Birthdays")`,
  firstBirthdayTemplate: `span:contains("Birthday 1")`,
  birthdaySlideImage: '[data-background-image^="https://k4connect-document-staging.s3.amazonaws.com/communities"]'
};

/**
 * This abstracts the actions relating to using Templates
 * @namespace Templates
 */
export default class Templates {
  /**
   * Method to open the templates dropdown
   */
  static open = () => Click.on(TP.btn)

  /**
   * Method to open the templates dropdown
   */
  static useBirthdayTemplate = () => {
    Click.onFirst(TP.birthdayTemplates)
    Click.on(TP.firstBirthdayTemplate)
  }
}

