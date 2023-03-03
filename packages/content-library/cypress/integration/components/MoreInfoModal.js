import { Click } from '../interactions';

/**
 * Content Card component namespace, these are the cards that make up the library
 * @prop {function} card the selectors for the view filter
 * @prop {string} moreInfo the selectors for more info button on the top left of the card
 * @prop {object} cardMenu the selectors for the card menu and its options in the top right of the card
 *
 */
export const MIM = {
  modal: '#CL_contentDetails',
  contentName: '#CL_contentDetails-contentName',
  dimensions: '#CL_contentDetails-dimensions',
  close: '#CL_contentDetails-close',
};

/**
 * This abstracts the actions relating to the MoreInfoModal
 * @namespace MoreInfoModal
 */
export default class MoreInfoModal {
  /**
   * Method to close the more info modal
   */
  static close = () => {
    Click.on(MIM.close);
  };

  /**
   * Method to get the name of the content from the modal
   */
  static getName = () => cy.get(MIM.contentName);

  /**
   * Method to get the dimensions of the content from the modal
   */
  static getDimensions = () => cy.get(MIM.dimensions);
}
