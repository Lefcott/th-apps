/** @format */

import { kebabCase } from 'lodash';

export default {
  signupsTable: '#EM_signupsTable',
  waitlistTable: '#EM_waitlistTable',
  RemoveFromAttendeesBtn: '.MuiIcon-root:contains("close")',
  EventAttendanceAddBtn: '.MuiButton-root:contains("Add")',
  waitlistRowFor: (name) =>
    `[id^=EM_waitlistTable-resident-${kebabCase(name)}]`,
  signedUpRowFor: (name) =>
    `[id^=EM_registeredTable-resident-${kebabCase(name)}]`,
  removeFromSignupsBtn: (name) =>
    `[id^=EM_registeredTable-delete-${kebabCase(name)}]`,
  moveFromSignupsBtn: (name) =>
    `[id^=EM_registeredTable-move-${kebabCase(name)}]`,
  removeFromWaitlistBtn: (name) =>
    `[id^=EM_waitlistTable-delete-${kebabCase(name)}]`,
  moveFromWaitlistBtn: (name) =>
    `[id^=EM_waitlistTable-move-${kebabCase(name)}]`,
  userSearchResultNamed: (name) =>
    `.MuiAutocomplete-option:contains("${name}")`,

  addToSignups: '#Em_signups-addToSignups',
  addToWaitlist: '#Em_signups-addToWaitlist',
  addResidentSearchbar: `#EM_undefined-residentSearchbar`,
  removeSignups:
    '#EM_registeredTable-resident-tammy-public-skill .MuiIconButton-colorSecondary path',
  removeWaitlist: '.MuiIconButton-colorSecondary path',
  findInSignupsSearchbar: `#EM_signupsTable input[placeholder="Search"]`,
  findInWaitlistSearchbar: `#EM_waitlistTable input[placeholder="Search"]`,
  signupSaveButton: `#Em_attendanceModal-save`,
  signupCancelButton: `#Em_attendanceModal-cancel`,
  addGuestButton: `#EM_signup-showGuestInput`,
  removeGuestButton: `#EM_signup-removeGuestInput`,
  guestSearchbar: `#EM_resident-guest-guestSearchbar`,
};
