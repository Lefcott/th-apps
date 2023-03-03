/**
 * Toast component namespace
 *
 * @format
 * @namespace
 * @prop {string} success the selector for the success toast
 * @prop {string} closeBtn the button to close the toast
 * @prop {function(text:string):string} containing function that returns selector a toast containing the string you pass in
 */

export const Toast = {
  root: ".MuiSnackbar-root",
  dismiss: "#EM_Toast-dismiss",
  deletedToast: '#client-snackbar:contains("was successfully deleted")',
  createdToast: '.EI-snackbar-success:contains("was successfully created")',
};
