/** @format */

import { Click } from '../interactions';
import filterDrawerElements from '../components/page-elements/filter-drawer/elements';

export default class OpenThe {
  static statusDrawer = () =>
    cy
      .get(filterDrawerElements.FilterSection('status', false, false))
      .within(($statusSection) => {
        const statusSectionCollapsed = $statusSection.find(
          filterDrawerElements.FilterSection('status', true, true),
        ).length;
        if (statusSectionCollapsed)
          Click.on(filterDrawerElements.FilterSection('status', true, true));
      });

  static calendarDrawer = () =>
    cy
      .get(filterDrawerElements.FilterSection('eventCalendars', false, false))
      .within(($calendarSection) => {
        const calSectionCollapsed = $calendarSection.find(
          filterDrawerElements.FilterSection('eventCalendars', true, true),
        ).length;
        if (calSectionCollapsed)
          Click.on(
            filterDrawerElements.FilterSection('eventCalendars', true, false),
          );
      });

  static eventTypeDrawer = () =>
    cy
      .get(filterDrawerElements.FilterSection('eventType', false, false))
      .within(($eventTypeSection) => {
        const eventTypeDrawerCollapsed = $eventTypeSection.find(
          filterDrawerElements.FilterSection('eventType', true, true),
        ).length;
        if (eventTypeDrawerCollapsed)
          Click.on(
            filterDrawerElements.FilterSection('eventType', true, false),
          );
      });
}
