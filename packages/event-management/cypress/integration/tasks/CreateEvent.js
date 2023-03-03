/** @format */

import RRule from 'rrule2';
import moment from 'moment-timezone';
import { extend, omit, sample } from 'lodash';
import { Verify } from '../assertions';
import { Click, Type } from '../interactions';
import EventFormElements from '../components/page-elements/event-form-page/elements';
import {
  NewEventBtn,
  EventSaveBtn,
} from '../components/page-elements/buttons/elements';
import { FREQ, WEEKDAYS } from '../utils/Consts';
const { MO } = WEEKDAYS;
let { DAILY, WEEKLY, MONTHLY } = FREQ;
import * as dt from '../utils/Time';

let stupidEscKeyHackToCloseMuiDropdown = () =>
  cy.get('body').trigger('keydown', { key: 'Escape' });
let ruleDefaults = {
  wkst: WEEKDAYS.SU,
  startDate: { ...moment().toObject() },
  endDate: {},
  until: undefined,
  repeat: 'doesNotRepeat',
  byhour: moment().toObject().hours,
  byminute: moment().toObject().minutes,
};

export default class Create {
  static anEvent = () => {
    cy.wait(5000);
    Click.on(NewEventBtn);
    return options;
  };
}
// Sets the name of the event
let named = (eventName) => {
  options.name = eventName;
  options.rule = { ...ruleDefaults };
  Type.theText(eventName).into(EventFormElements.basicInfo.name);
  return options;
};
// Sets the location of the event
let locatedInLocation = (eventLocation) => {
  Click.on(EventFormElements.basicInfo.location.dropdown);
  Click.on(EventFormElements.basicInfo.location.named(eventLocation));
  return options;
};
// Sets the calendar of the event
let belongingToCalendar = (eventCal) => {
  Type.theText(`${eventCal}{downarrow}{enter}`).into(
    EventFormElements.basicInfo.calendars,
  );
  return options;
};
// Sets the event status
let withStatus = {
  draft: () => {
    Click.on(EventFormElements.basicInfo.status.dropdown);
    Click.on(EventFormElements.basicInfo.status.Draft);
    return options;
  },
  published: () => {
    Click.on(EventFormElements.basicInfo.status.dropdown);
    Click.on(EventFormElements.basicInfo.status.Published);
    return options;
  },
  archived: () => {
    Click.on(EventFormElements.basicInfo.status.dropdown);
    Click.on(EventFormElements.basicInfo.status.Archived);
    return options;
  },
};
// Sets the event description
let withDescription = (eventDescription) => {
  Type.theText(eventDescription).into(EventFormElements.basicInfo.description);
  return options;
};

let link = {
  withEventUrl: (eventUrl) => {
    Type.theText(eventUrl).into(EventFormElements.virtualEvent.url);
    Verify.theElement(EventFormElements.basicInfo.linkPreview).isVisible();
    return options;
  },
};

let source = {
  fromVideoSource: (vidSrc) => {
    //click on video source dropdown, select video source
    Type.theText(`${vidSrc}{downarrow}{enter}`).into(
      EventFormElements.virtualEvent.source.dropdown,
    );
    return link;
  },
};

let thatIsVirtual = () => {
  Click.on(EventFormElements.virtualEvent.virtualEventToggle);
  return {
    thatIsShownOnTvChannel: (channel) => {
      Click.on(EventFormElements.virtualEvent.showOnTvToggle);
      //click on tv channel dropdown, select channel
      Type.theText(`${channel}{downarrow}{enter}`).into(
        EventFormElements.virtualEvent.channel.dropdown,
      );
      return source;
    },
    withEventUrl: link.withEventUrl,
  };
};

let defaultRule = (rule) => {
  let repeatString = rule.repeat;
  let r;
  switch (repeatString) {
    case 'doesNotRepeat':
      r = omit(rule, [
        'until',
        'interval',
        'byweekday',
        'bysetpos',
        'custom',
        'byhour',
        'byminute',
        'repeat',
        'startDate',
        'endDate',
      ]);
      r.count = 1;
      return r;
    case 'repeatDaily':
      r = omit(rule, [
        'count',
        'interval',
        'byweekday',
        'bysetpos',
        'custom',
        'repeat',
        'startDate',
        'endDate',
      ]);
      return r;
    case 'repeatWeekly':
      r = omit(rule, [
        'count',
        'interval',
        'byweekday',
        'bysetpos',
        'custom',
        'repeat',
        'startDate',
        'endDate',
      ]);
      return r;
    case 'repeatMonthly':
      r = omit(rule, [
        'count',
        'until',
        'interval',
        'byweekday',
        'bysetpos',
        'custom',
        'repeat',
        'startDate',
        'endDate',
      ]);
      return r;
    case 'custom':
      r = omit(rule, [
        'count',
        'repeat',
        'bysetpos',
        'startDate',
        'endDate',
        'until',
      ]); //'interval', 'freq']);
      return r;
  }
};

let save = () => {
  Click.on(EventSaveBtn);
  let rs = extend(
    moment({ hours: 8, minutes: 30 }).toObject(),
    options.rule.startDate,
  );
  let re = extend(
    moment({ hours: 23, minutes: 45 }).add(3, 'M').toObject(),
    options.rule.endDate,
  );
  console.log('___-_-_re_-_-___ :\n\n\n', re, '\n\n');
  options.rule.dtstart = moment([
    rs.years,
    rs.months,
    rs.date,
    rs.hours,
    rs.minutes,
  ])._d;
  options.rule.until = moment([
    re.years,
    re.months,
    re.date,
    re.hours,
    re.minutes,
  ])._d;
  let def = defaultRule(options.rule);
  options.rule = new RRule(def);

  return options;
};

let validate = () => {
  console.log(
    '___-_-_Event RRule, Text Form_-_-___ :\n\n\n',
    options.rule.toText(),
    '\n\n',
  );
  const start = moment().hours(0).minutes(-1)._d;
  const end = moment().add(3, 'M').hours(24).milliseconds(-1).date(0)._d; //three months out, can relax once three month task is complete
  //get a random date and validate it
  let occuranceToValidate = sample(options.rule.between(start, end, true));
  if (occuranceToValidate) {
    console.log(
      'Verifying an event exists on:',
      occuranceToValidate.toLocaleDateString(),
    );
    Verify.theEventNamed(options.name).existsOnThisDate(
      moment(occuranceToValidate),
    );
  } else {
    // debugger;
    console.log(
      'This event doesnt have occurances that will show up on the calendar',
    );
  }
  options.rule = {};
};

/*__-__-__-_Schedule_-__-__-__*/
let withStartDate = (eventStartDate) => {
  //TODO: This right now is "required" event thought there's a default value already.
  // I think something isnt getting reset properly between test runs. As failing tests run fine individually (see: C924, C804)
  options.rule.startDate.years = eventStartDate.year();
  options.rule.startDate.months = eventStartDate.month();
  options.rule.startDate.date = eventStartDate.date();

  let formattedStartDate = dt.eventFormDateFormat(eventStartDate);
  Type.theText(formattedStartDate).into(
    EventFormElements.schedule.startDate.input,
  );
  return options;
};

let withEndDate = (eventEndDate) => {
  //at some point we should only make this "callable" if the event is repeating
  options.rule.endDate.years = eventEndDate.year();
  options.rule.endDate.months = eventEndDate.month();
  options.rule.endDate.date = eventEndDate.date();

  let formattedEndDate = dt.eventFormDateFormat(eventEndDate);
  Type.theText(formattedEndDate).into(EventFormElements.schedule.endDate.input);
  return options;
};

let withStartTime = (eventStartTime) => {
  options.rule.byhour = eventStartTime.hours();
  options.rule.byminute = eventStartTime.minutes();
  options.rule.startDate.hours = eventStartTime.hours();
  options.rule.startDate.minutes = eventStartTime.minutes();
  let formattedStartTime = dt.eventFormTimeFormat(eventStartTime);
  Type.theText(formattedStartTime).into(
    EventFormElements.schedule.startTime.input,
  );
  return options;
};

let withEndTime = (eventEndTime) => {
  options.rule.endDate.hours = eventEndTime.hours();
  options.rule.endDate.minutes = eventEndTime.minutes();
  let formattedEndTime = dt.eventFormTimeFormat(eventEndTime);
  Type.theText(formattedEndTime).into(EventFormElements.schedule.endTime.input);
  return options;
};

let isAllDay = () => {
  Click.on(EventFormElements.schedule.allDay);
  return options;
};

let thatRepeats = () => {
  Click.on(EventFormElements.schedule.repeat.dropdown);
  return {
    never: () => {
      options.rule.count = 1;
      options.rule.freq = DAILY;
      options.rule.repeat = 'doesNotRepeat';
      Click.on(EventFormElements.schedule.repeat.doesNotRepeat);
      return options;
    },
    daily: () => {
      options.rule.freq = DAILY;
      options.rule.repeat = 'repeatDaily';
      Click.on(EventFormElements.schedule.repeat.daily);
      return options;
    },
    weekly: () => {
      options.rule.freq = WEEKLY;
      options.rule.repeat = 'repeatWeekly';
      Click.on(EventFormElements.schedule.repeat.weekly);
      return options;
    },
    monthly: () => {
      options.rule.freq = MONTHLY;
      options.rule.repeat = 'repeatMonthly';
      Click.on(EventFormElements.schedule.repeat.monthly);
      return options;
    },
    withACustomSchedule: () => {
      Click.on(EventFormElements.schedule.repeat.custom.option);
      options.rule.repeat = 'custom';
      return {
        every: (repeatNum) => {
          options.rule.interval = repeatNum;
          //Typing into "Repeat Every *" input
          Type.theText(repeatNum).into(
            EventFormElements.schedule.repeat.custom.interval,
          );
          //Clicking on "Frequency *" dropdown
          Click.on(EventFormElements.schedule.repeat.custom.freq.dropdown);

          //function for selecting days of week shared between week and month repeat options
          let daysOfWeekSelector = (daysOfWeekWeWantSelected) => {
            Click.on(
              EventFormElements.schedule.repeat.custom.daysOfWeek.dropdown,
            );
            //click on monday to unselect it I guess?
            Click.on(
              EventFormElements.schedule.repeat.custom.daysOfWeek.checkbox(MO),
            );
            daysOfWeekWeWantSelected.forEach((dayOfWeek) => {
              if (options.rule.bysetpos) {
                options.rule.bysetpos.forEach((pos) => {
                  let nthdDayOfWeek = dayOfWeek.nth(pos);
                  options.rule.byweekday = options.rule.byweekday
                    ? [...options.rule.byweekday, nthdDayOfWeek]
                    : [nthdDayOfWeek];
                });
              }
              Click.on(
                EventFormElements.schedule.repeat.custom.daysOfWeek.checkbox(
                  dayOfWeek,
                ),
              );
            });
            // maybe figure out a better way for this. It's needed for non monthly repeating schedules
            options.rule.byweekday =
              options.rule.byweekday || daysOfWeekWeWantSelected;
            stupidEscKeyHackToCloseMuiDropdown();
            // options.withEndDate = withEndDate;
            return options;
          };

          return {
            days: () => {
              options.rule.freq = DAILY;
              Click.on(EventFormElements.schedule.repeat.custom.freq.days);
              // options.withEndDate = withEndDate;
              return options;
            },
            weeks: () => {
              options.rule.freq = WEEKLY;
              Click.on(EventFormElements.schedule.repeat.custom.freq.weeks);
              return {
                onDays: daysOfWeekSelector,
              };
            },
            months: () => {
              options.rule.freq = MONTHLY;
              Click.on(EventFormElements.schedule.repeat.custom.freq.months);
              return {
                //select the month multiple here
                every: (arrayOfNthDaysWeWantSelected) => {
                  Click.on(
                    EventFormElements.schedule.repeat.custom.nthDayOfWeek
                      .dropdown,
                  );
                  arrayOfNthDaysWeWantSelected.forEach((nth) => {
                    options.rule.bysetpos = options.rule.bysetpos
                      ? [...options.rule.bysetpos, nth]
                      : [nth];
                    Click.on(
                      EventFormElements.schedule.repeat.custom.nthDayOfWeek.listItem(
                        nth,
                      ),
                    );
                  });
                  stupidEscKeyHackToCloseMuiDropdown();
                  return {
                    onDays: daysOfWeekSelector,
                  };
                },
              };
            },
          };
        },
      };
    },
  };
};

/*__-__-__-_More Information_-__-__-__*/
// Sets event type
let thatHasType = (eventType) => {
  Click.on(EventFormElements.moreInfo.eventType.dropdown);
  Click.on(EventFormElements.moreInfo.eventType.type(eventType));
  return options;
};

let thatCostsMoney = () => {
  Click.on(EventFormElements.moreInfo.costsMoney);
  return options;
};
// Sets number of spots event can hold
let thatIsLimitedToNResidents = (residentLimit) => {
  Click.on(EventFormElements.moreInfo.limitedSpots.checkbox);
  Type.theText('{backspace}' + residentLimit).into(
    EventFormElements.moreInfo.limitedSpots.input,
  );
  return options;
};

let thatIsHiddenFromDailyCalendar = () => {
  Click.on(EventFormElements.widgetOptions.hideFromDailyCal);
  return options;
};
let thatIsHiddenFromWeeklyCalendar = () => {
  Click.on(EventFormElements.widgetOptions.hideFromWeeklyCal);
  return options;
};
let thatIsHiddenFromMonthlyCalendar = () => {
  Click.on(EventFormElements.widgetOptions.hideFromMonthlyCal);
  return options;
};
let thatHasEventNameTruncatedOnCalendar = () => {
  Click.on(EventFormElements.widgetOptions.truncateEventName);
  return options;
};
let thatHasEndTimeShownOnCalendar = () => {
  // This one defaults to checked so make sure this is working right
  // will have to validate all these at some point but this should be ok for now
  Click.on(EventFormElements.widgetOptions.showEventEndTimes);
  return options;
};
const options = {
  save,
  validate,
  named,
  locatedInLocation,
  belongingToCalendar,
  withStatus,
  withDescription,
  thatIsVirtual,
  withStartDate,
  withStartTime,
  withEndDate,
  withEndTime,
  isAllDay,
  thatRepeats,
  thatCostsMoney,
  thatIsLimitedToNResidents,
  thatHasType,
  thatIsHiddenFromDailyCalendar,
  thatIsHiddenFromWeeklyCalendar,
  thatIsHiddenFromMonthlyCalendar,
  thatHasEventNameTruncatedOnCalendar,
  thatHasEndTimeShownOnCalendar,
};

options.rule = {};
options.name = '';
