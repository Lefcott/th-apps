/** @format */

import MonthCalElements from '../../page-elements/month-cal/elements';
import moment from 'moment-timezone';
/**
 * This abstracts the actions relating to the month calendar
 * @namespace MonthCal
 *
 */
export default class MonthCal {
  /**
   * Navigates the monthly calendar to the inputted month
   * @example MonthCal.navToMonth('JUNE')
   * @param {string} m month you want to navigate to.
   */
  static navToMonth(m, y) {
    //Should refactor this to take a Moment month representation
    // this is dumb, should make it read better.
    // Is there a standard way to have a recursive static method?
    navigateToMonth(m, y);
  }

  /**
   * Navigates the monthly calendar to the inputted day
   * @example MonthCal.clickOnDay(17)
   * @param {int} day day you want to navigate to
   */
  static clickOnDay(day) {
    cy.get('.MuiPickersDay-day')
      .not('.MuiPickersDay-hidden')
      .filter((i, el) => {
        if (el.innerText == day) {
          return el;
        }
      })
      //figure out why this is needed
      .first()
      .click();
  }
}

let navigateToMonth = (month, year = moment().year()) => {
  //check again at end of year to make sure this isn't broken again then
  cy.get(MonthCalElements.header).then(($header) => {
    const [headerMonth, headerYear] = $header.text().split(' ');
    const eventDate = moment().month(month).year(year);
    const miniCal = moment().month(headerMonth).year(headerYear);
    let btn;

    if (eventDate.isSame(miniCal, 'month')) {
      //if the mini cal has the same month as the event stop recursing
      return;
    } else if (eventDate.isAfter(miniCal)) {
      //if the event is after the mini cal, make the btn the next month btn
      btn = MonthCalElements.nextMonth;
    } else {
      //if the event is before the mini cal, make the btn the prev month btn
      btn = MonthCalElements.prevMonth;
    }
    cy.get(btn)
      .not('.Mui-disabled')
      .then(($nmb) => {
        $nmb.click();
        navigateToMonth(month, year);
      });
  });
};
