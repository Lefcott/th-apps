/** @format */
import "cypress-xpath";
import { Verify } from '../../../assertions';
import { Click, Type } from '../../../interactions';
import {
  EditEventElements,
  EventToastMessages,
  EventCalendarElements,
  EventManagerButtons,
  EventStatusElements,
  EventManagerElements,
} from '../../page-elements/event-model/elements';
export default class EventManagerPage {
  static publishEvent = (eventName, isRepublish) => {
    Click.on(EditEventElements.publishBtn);
    if (isRepublish) {
      Verify.theElement(
        EventToastMessages.eventEditedSuccess.replace('%s', eventName),
      ).isVisible();
    } else {
      Verify.theElement(
        EventToastMessages.eventCreatedSuccess.replace('%s', eventName),
      ).isVisible();
    }
    Click.on(EventToastMessages.dismiss);
  };

  static saveAsDraftEvent = (eventName, isResave) => {
    Click.onLastElement(EditEventElements.statusDropDown);
    Click.on(EditEventElements.saveAsDraftAction);
    if (isResave) {
      Verify.theElement(
        EventToastMessages.eventEditedSuccess.replace('%s', eventName),
      ).isVisible();
    } else {
      Verify.theElement(
        EventToastMessages.eventCreatedSuccess.replace('%s', eventName),
      ).isVisible();
    }
    Click.on(EventToastMessages.dismiss);
  };

  static moveToArchived = (eventName) => {
    Click.onLastElement(EditEventElements.statusDropDown);
    Click.on(EditEventElements.archiveAction);
    Verify.theElement(
      EventToastMessages.arichivedToast.replace('%s', eventName),
    ).isVisible();
    Click.on(EventToastMessages.dismiss);
  };

  static openReoccurringEvent = (eventName) => {
    Click.onFirstElement(EventCalendarElements.calendarSunday);
    Click.onFirstElement(
      EventCalendarElements.createdEvent.replace('%s', eventName),
    );
    Click.on(EventManagerButtons.allEventOption);
    Click.on(EventManagerButtons.confirmOkBtn);
  };

  static openSingleEvent = (eventName) => {
    Click.onFirstElement(EventCalendarElements.calendarSunday);
    Click.onFirstElement(
      EventCalendarElements.createdEvent.replace('%s', eventName),
    );
  };

  static editEvent = (eventDetails) => {
    if (eventDetails.EventName) {
      Type.theText(eventDetails.EventName).into(
        EditEventElements.eventNameInput,
      );
    }

    if (eventDetails.VirtualEvent) {
      Click.on(EditEventElements.virtualEventToggle);
    }
  };

  static deleteAllEvents = () => {
    Click.onClickMouseOverElement(EventManagerButtons.deleteEventKebab);
    Verify.theElement(EventManagerButtons.deleteBtn).contains('Delete');
    Click.onFirstElement(EventManagerButtons.deleteBtn);
    Click.on(EventManagerButtons.allEventOption);
    Click.on(EventManagerButtons.confirmOkBtn);
  };

  static deleteSingleEvent = () => {
    Click.onClickMouseOverElement(EventManagerButtons.deleteEventKebab);
    Verify.theElement(EventManagerButtons.deleteBtn).contains('Delete');
    Click.on(EventManagerButtons.deleteBtn);
    Click.on(EventManagerButtons.confirmOkBtn);
    Verify.theElement(EventToastMessages.deletedToast).isVisible();
    Click.on(EventToastMessages.dismiss);
  };

  static applyStatusFilterAndVaidate = (eventStatus, eventName) => {
    Click.on(EventStatusElements.allStatus);
    Click.on(EventStatusElements.allStatus);
    Click.on(EventStatusElements.status.replace('%s', eventStatus));
    Type.theText(eventName).into(EventManagerElements.eventSearchbar);
    Verify.theElement(
      EventCalendarElements.createdEvent.replace('%s', eventName),
    ).isVisible();
  };

  static openPreviewMonthlyCalendar =() => {
    const url ='https://widgets-staging.k4connect.com/calendars/month?communityId=3134'
    cy.window().then((win) => {
    cy.stub(win, 'open', () => {
          win.location.href = url
      }).as('popup') 
  })
   cy.xpath(EventManagerElements.previewLink).invoke('removeAttr', 'target');
   cy.xpath(EventManagerElements.previewlinkButton).click();
   cy.url().should('include', url );
    };
  
  static verifyPreviewMonthlyCalendar =()=> {
    const date = new Date(); 
    const month = date.toLocaleString('default', { month: 'long' }); 
    const year = date.getFullYear(); 
    cy.xpath(EventManagerElements.currentMonth.replace('%s',`${month} ${year}`)).should('be.visible');
  };
}
