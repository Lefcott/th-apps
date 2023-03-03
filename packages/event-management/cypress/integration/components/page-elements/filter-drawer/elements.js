/**
 * Filter Drawer component namespace
 *
 * @format
 * @namespace
 * @prop {string} Searchbar the searchbar in the filter drawer below the monthly calendar
 * @prop {string} SettingsDrawer the settings button at the bottom of the filter drawer
 * @prop {function(sectionName:string,header:boolean,collapsed:boolean):string} FilterSection function that returns selector for accordian section in filter drawer (eg. Calendars)
 */

export default {
  Searchbar: '#Em_eventSearchbar',
  settingsDrawer: '#Em_drawer-settings',
  FilterSection: (sectionName, header, collapsed) =>
    `#Em_expander-${sectionName}${header ? '-header' : ''}${
      collapsed ? '[aria-expanded="false"]' : ''
    }`,
  listBtn: (name, checked) =>
    checked
      ? `.MuiListItem-button:contains("${name}") .Mui-checked`
      : `.MuiListItem-button:contains("${name}")`,
  statusRadio: (name) => `#Em-status-filter-${name}`,
};
