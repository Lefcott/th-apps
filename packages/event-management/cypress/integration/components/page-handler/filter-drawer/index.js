/** @format */

import { Click } from '../../../interactions';
import { OpenThe } from '../../../utils';
import FilterDrawerElements from '../../page-elements/filter-drawer/elements';

/**
 * This abstracts the actions relating to the drawer containing the monthly calendar and filters for events
 * @namespace EventModal
 * @example Click.on($recurringEvent);
 * EventModal.editSeries()
 */
export default class FilterDrawer {
  /**
   * Shows the filter drawer if it is hidden
   */
  static show = () =>
    cy.get('body').then(($body) => {
      if ($body.find('#Em_calendar-openFilters').length)
        Click.on('#Em_calendar-openFilters');
    });

  /**
   * Hides the filter drawer if it is showing
   */
  static hide = () =>
    cy.get('.MuiDrawer-root').then(($body) => {
      if ($body.find('#Em_drawer-close').length) Click.on('#Em_drawer-close');
    });

  /**
   * Namespace for filtering events shown based on the date
   */
  static theDate = {
    toDay: (day) =>
      cy
        .get('.MuiPickersDay-day')
        .not('.MuiPickersDay-hidden')
        .filter((i, el) => {
          if (el.innerText == day) return el;
        })
        .click(),
  };

  /**
   * Namespace for filtering the events shown based on status
   */
  static status = {
    toPublished: () => changeStatusTo('published'),
    toDrafts: () => changeStatusTo('draft'),
    toArchived: () => changeStatusTo('archived'),
    toAll: () => changeStatusTo('all'),
  };

  /**
   * Namespace for filtering the events shown based on calendar
   */
  static calendar = {
    toTestCal: () => {
      OpenThe.calendarDrawer();
    },
  };
}

const changeStatusTo = (status) => {
  OpenThe.statusDrawer();
  Click.on(FilterDrawerElements.statusRadio(status));
};
