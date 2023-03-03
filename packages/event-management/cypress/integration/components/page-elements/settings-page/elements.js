/**
 * Settings Page component namespace
 *
 * @format
 * @namespace
 * @prop {string} newBtn
 * @prop {string} nameInput he selector for the searchbar for signups
 * @prop {string} saveBtn the button that removes someone from the attendance of an event
 * @prop {string} lastDeleteBtn the button that adds someone to the attendance of an event
 * @prop {string} lastRow the event attenda submenu option that returns the Add to Signups list item selector from the sidenav
 * @prop {string} lastRowDeleteConfirm the event attendance submenu option that returns the attendance tracking list item selector from the sidenav
 */

export default {
  header: '#Em_Settings-pageHeader',
  newBtn: 'button[class="MuiButtonBase-root MuiIconButton-root"]',
  nameInput: '[mode="add"] input[placeholder="Name *"]',
  saveBtn: '[mode="add"] [title="Save"]',
  lastDeleteBtn: 'button[title="Delete"]',
  lastEditBtn: 'tr:last-child() button[title="Edit"]',
  lastRow: 'tr:last-child()',
  lastRowDeleteConfirm: 'button[title="Save"]',
  CalendarsTab: '.MuiListItem-button > div:contains("Calendars")',
  EventTypesTab: '.MuiListItem-button > div:contains("Event Types")',
  LocationsTab: '.MuiListItem-button > div:contains("Locations")',
  abbvInput:
    ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
  nameEdit:
    '[data="[object Object]"] > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
  editSave: '[title="Save"]',
  searchBar: 'input[placeholder="Search"]',
};
