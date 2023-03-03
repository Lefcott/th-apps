/**
 * Toast component namespace
 *
 */
export const T = {
  toast: '#notistack-snackbar',
  errorToast: '.Toastify__toast--error',
  successToast: '.Toastify__toast--success',
  containing: (text) => `.Toastify__toast :contains("${text}")`,
};

/**
 * This abstracts the actions relating to the Toast
 * @namespace Toast
 */
export default class Toast {
  /**
   * Method to get the text of the loading modal
   */
  static getText = () => cy.get(T.toast).text();
}
