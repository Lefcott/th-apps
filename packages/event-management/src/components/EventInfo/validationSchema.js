/** @format */

import * as Yup from 'yup';
import { get, includes, isInteger } from 'lodash';
import urlParser from 'js-video-url-parser';
import moment from 'moment-timezone';
import strings from '../../constants/strings';
import { generateStartDate } from '../../utils/helpers';

const thirdPartyUrls = ['community.spiro100.com', 'lambda.k4connect.com'];

const eodYesterday = moment().subtract(1, 'day').endOf('day');
Yup.addMethod(Yup.string, 'matchVideoSource', function (
  videoSourceFormat,
  message = strings.Event.validation.videoUrl,
) {
  return this.test('isValidUrlLink', message, function (value) {
    const { path, createError } = this;
    if (!value) {
      return createError({ path, message });
    }
    const parsedUrlObj = urlParser.parse(value);
    if (!parsedUrlObj) {
      if (
        !thirdPartyUrls.some((thirdPartyUrl) =>
          value.match(new RegExp(thirdPartyUrl, 'gi')),
        )
      ) {
        return createError({ path, message });
      } else {
        return true;
      }
    } else {
      return true;
    }
  });
});

Yup.addMethod(Yup.date, 'validDate', function (testDate, message) {
  return this.test(function (value) {
    const { path, createError } = this;
    const dateFormat = 'MM/DD/YYYY';
    const isValidDate = moment(value, dateFormat, true).isValid();
    if (!isValidDate) {
      return createError(path, message);
    } else {
      return true;
    }
  });
});

const eventSchema = Yup.object().shape({
  _id: Yup.string(),
  name: Yup.string().max(50).required(strings.Event.validation.eventName),
  calendars: Yup.array()
    .min(1, strings.Event.validation.calendarsMin)
    .required(strings.Event.validation.mustBe('an array')),
  status: Yup.string().required(strings.Event.validation.status),
  url: Yup.string()
    .url(strings.Event.validation.validUrl)
    .matches(/^https/i, strings.Event.validation.validUrl)
    .when(
      ['videoSource', 'isAVirtualEvent'],
      (videoSource, isAVirtualEvent, schema) => {
        if (isAVirtualEvent && !get(videoSource, 'type')) {
          return schema.required(strings.Event.validation.validUrl);
        } else {
          return get(videoSource, 'type') === 'Web'
            ? schema
                .required(strings.Event.validation.url)
                .matchVideoSource(videoSource.name)
            : schema.nullable();
        }
      },
    )
    .nullable(),
  startDate: Yup.date()
    .required(strings.Event.validation.validStartDate)
    .when(['rule'], (rule, schema) => {
      if (rule && rule.until) {
        return schema.max(
          rule.until,
          strings.Event.validation.startDatePriorToEndDate,
        );
      }
    })
    .min(eodYesterday, strings.Event.validation.startDateNotInThePast)
    .validDate(Yup.ref('$startDate'), strings.Event.validation.validStartDate)
    .nullable()
    .typeError(strings.Event.validation.validStartDate),
  startTime: Yup.date()
    .required(strings.Event.validation.validStartTime)
    .when(['startDate', 'allDay'], (startDate, allDay, schema) => {
      // start time and start date are two separate objects. Validate time if the start date is before now time,
      if (moment(startDate).isBefore() && !allDay) {
        return schema.min(
          moment(),
          strings.Event.validation.startTimeNotInThePast,
        );
      }
    }),
  duration: Yup.number().min(
    1,
    strings.Event.validation.endTimeLaterThanStartTime,
  ),
  signupsEndDate: Yup.date()
    .when(['startDate', 'startTime'], (startDate, startTime, schema) => {
      if (moment(startDate).isValid()) {
        const startDateTime = generateStartDate(startDate, startTime);
        return schema
          .max(
            startDateTime.format(),
            strings.Event.validation.signupsEndDatePriorToStartDate,
          )
          .min(moment(), strings.Event.validation.signupsEndDateNotInThePast);
      }
    })
    .typeError(strings.Event.validation.validDate)
    .nullable(),
  signupsEndTime: Yup.date()
    .when(['signupsEndDate'], (signupsEndDate, schema) => {
      schema;
      return signupsEndDate
        ? schema.required(strings.Event.validation.validTime)
        : schema;
    })
    .typeError(strings.Event.validation.validDate)
    .nullable(),
  // Schedule Section
  rule: Yup.object({
    interval: Yup.number()
      .when('custom', (custom, schema) =>
        custom
          ? schema.required(strings.Event.validation.repeatingInterval)
          : schema.optional(),
      )
      .positive()
      .integer(strings.Event.validation.mustBe('an integer'))
      .min(1, strings.Event.validation.cannotBe('less than 1'))
      .max(10, strings.Event.validation.cannotBe('more than 10')),
    freq: Yup.string().when(
      ['interval', 'custom'],
      (interval, custom, schema) =>
        custom && interval
          ? schema.required(strings.Event.validation.frequency)
          : schema.optional(),
    ),
    byweekday: Yup.array().when(['freq', 'custom'], (freq, custom, schema) =>
      custom && includes(['1', '2'], freq)
        ? schema.required(strings.Event.validation.oneWeekday)
        : schema.nullable(),
    ),
  }).nullable(),
  // More Info Section
  numSpots: Yup.number()
    .typeError(strings.Event.validation.validNumber)
    .integer()
    .nullable()
    .when(
      ['openSpots', 'totalSpots', 'numSignups'],
      (openSpots, totalSpots, numSignups, schema) => {
        let min, msg;
        if (numSignups) {
          return schema.min(
            numSignups,
            strings.Event.validation.residentsHaveSignedUp(numSignups),
          );
        }

        if (isInteger(openSpots)) {
          min = totalSpots - openSpots;
          msg = strings.Event.validation.residentsHaveSignedUp(min);
        } else {
          min = 1;
          msg = strings.Event.validation.oneSpot;
        }
        return schema.min(min, msg);
      },
    ),

  videoSource: Yup.object().when(['showOnTv'], (showOnTv, schema) => {
    if (showOnTv) {
      return schema.required(strings.Event.validation.videoSource);
    }
    return schema.nullable();
  }),
  virtualEventDestinations: Yup.array().when(
    ['showOnTv'],
    (showOnTv, schema) => {
      if (showOnTv) {
        return schema.required(strings.Event.validation.videoSource);
      }
      return schema.nullable();
    },
  ),
});

export default eventSchema;
