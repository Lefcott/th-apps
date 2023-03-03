/**
 * Toast component namespace
 *
 * @format
 * @namespace
 * @prop {string} success the selector for the success toast
 * @prop {string} closeBtn the button to close the toast
 * @prop {function(text:string):string} containing function that returns selector a toast containing the string you pass in
 */

export default {
  root: '.MuiSnackbar-root',
  notificationBanner: '#notistack-snackbar',
  dismiss: '.teamhub-toast-MuiButton-label',
  deletedToast: '#notistack-snackbar:contains("was successfully deleted")',
  createdToast: '.EI-snackbar-success:contains("was successfully created")',
  editedToast: '.EI-snackbar-success:contains("was successfully edited")',
  removedAttendee: '#notistack-snackbar:contains("successfully removed")',
  movedAttendee: '#notistack-snackbar:contains("successfully moved")',
  withdrawnAttendeeFromEvent:
    '#notistack-snackbar:contains("successfully withdrawn")',
  addedAttendee: '#notistack-snackbar:contains("successfully added")',
  newMan: '#notistack-snackbar:contains("new man")',
  addedSignup: 'You successfully added',
};
