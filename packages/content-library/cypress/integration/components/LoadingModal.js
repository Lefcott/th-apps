/**
 * Loading Modal component namespace, this is the loading modal with the animated newtons cradle
 * @prop {string} modal the selectors for the modal itself
 *
 */
export const LM = {
  modal: '#CL_loadingModal',
};

/**
 * This abstracts the actions relating to the LoadingModal
 * @namespace LoadingModal
 */
export default class LoadingModal {
  /**
   * Method to get the text of the loading modal
   */
  static getText = () => cy.get(LM.modal).text();
}
