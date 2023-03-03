/** @format */

import { Click, Type } from '../../../interactions';
import { Verify } from '../../../assertions';
import AttendanceSignupElements from '../../page-elements/attendance-signups-page/elements';
import ToastElements from '../../page-elements/toast/elements';
import { BackToEvents } from '../../page-elements/buttons/elements';
import EventSideNavElements from '../../page-elements/event-sidenav/elements';
import { GuestInfo } from '../../../utils/Consts';
export default class AttendanceSignups {
  /**
   * Method to Add a user to an event
   */
  static openEventAttendanceTracking = () => {
    Click.on(EventSideNavElements.EventSideNavAttendanceTracking);
    Click.on(EventSideNavElements.EventSideNavSignupsWaitList);
  };

  static addUserNamed = (name) => {
    cy.get(AttendanceSignupElements.EventAttendanceAddBtn).trigger('mouseover');
    return {
      toSignups: () => {
        Click.forcefullyOn(AttendanceSignupElements.addToSignups);
        Type.theText(name).into(AttendanceSignupElements.addResidentSearchbar);
        Click.onFirstElement(
          AttendanceSignupElements.userSearchResultNamed(name),
        );
        Click.on(AttendanceSignupElements.signupSaveButton);
        Type.theText(name).into(
          AttendanceSignupElements.findInSignupsSearchbar,
          'Signups Searchbar',
        );
        Verify.theElement(
          AttendanceSignupElements.signedUpRowFor(name),
        ).isVisible();
        Verify.theElement(ToastElements.addedAttendee).isVisible();
        Click.on(ToastElements.dismiss);
      },
      toWaitlist: () => {
        Click.forcefullyOn(AttendanceSignupElements.addToWaitlist);
        Type.theText(name).into(AttendanceSignupElements.addResidentSearchbar);
        Click.onFirstElement(
          AttendanceSignupElements.userSearchResultNamed(name),
        );
        Click.on(AttendanceSignupElements.signupSaveButton);
        Type.theText(name).into(
          AttendanceSignupElements.findInWaitlistSearchbar,
          'Waitlist Searchbar',
        );
        Verify.theElement(ToastElements.addedAttendee).isVisible();
        Click.on(ToastElements.dismiss);
        Verify.theElement(
          AttendanceSignupElements.waitlistRowFor(name),
        ).isVisible();
      },
    };
  };

  static removeUserNamed = (name) => {
    return {
      fromSignups: () => {
        Click.forcefullyOn(AttendanceSignupElements.removeFromSignupsBtn(name));
        Verify.theElement(
          AttendanceSignupElements.signedUpRowFor(name),
        ).isNotExist();
        Verify.theElement(ToastElements.withdrawnAttendeeFromEvent).isVisible();
        Click.on(ToastElements.dismiss);
      },
      fromWaitlist: () => {
        Click.forcefullyOn(
          AttendanceSignupElements.removeFromWaitlistBtn(name),
        );
        Verify.theElement(
          AttendanceSignupElements.waitlistRowFor(name),
        ).isNotExist();
        Verify.theElement(ToastElements.withdrawnAttendeeFromEvent).isVisible();
        Click.on(ToastElements.dismiss);
        Verify.theElement(BackToEvents);
        Click.on(BackToEvents);
      },
    };
  };

  static moveUserNamed = (name) => {
    return {
      fromSignupsToWaitlist: () => {
        Click.forcefullyOn(AttendanceSignupElements.moveFromSignupsBtn(name));
        Verify.theElement(
          AttendanceSignupElements.signedUpRowFor(name),
        ).isNotExist();
        Verify.theElement(
          AttendanceSignupElements.waitlistRowFor(name),
        ).isVisible();
      },
      fromWaitlistToSignups: () => {
        Click.forcefullyOn(AttendanceSignupElements.moveFromWaitlistBtn(name));
        Verify.theElement(
          AttendanceSignupElements.waitlistRowFor(name),
        ).isNotExist();
        Verify.theElement(
          AttendanceSignupElements.signedUpRowFor(name),
        ).isVisible();
      },
    };
  };

  static addGuestName = (name) => {
    cy.get(AttendanceSignupElements.EventAttendanceAddBtn).trigger('mouseover');
    return {
      toSignups: () => {
        Click.forcefullyOn(AttendanceSignupElements.addToSignups);
        Type.theText(name).into(AttendanceSignupElements.addResidentSearchbar);
        Click.onFirstElement(
          AttendanceSignupElements.userSearchResultNamed(name),
        );
        Click.on(AttendanceSignupElements.addGuestButton);
        Type.theText(GuestInfo.GUEST_NAME).into(
          AttendanceSignupElements.guestSearchbar,
        );
        Click.on(AttendanceSignupElements.signupSaveButton);
        Type.theText(name).into(
          AttendanceSignupElements.findInSignupsSearchbar,
          'Signups Searchbar',
        );
        Verify.theElement(
          AttendanceSignupElements.signedUpRowFor(name),
        ).isVisible();
        Verify.theElement(ToastElements.addedAttendee).isVisible();
        Click.on(ToastElements.dismiss);
      },
    };
  };
}
