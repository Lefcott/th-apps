/** @format */
import moment from 'moment-timezone';

export function getFieldErrorNames(formikErrors) {
  const transformObjectToDotNotation = (obj, prefix = '', result = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (!value) return;

      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object') {
        transformObjectToDotNotation(value, nextKey, result);
      } else {
        result.push(nextKey);
      }
    });

    return result;
  };

  return transformObjectToDotNotation(formikErrors);
}

/**
 * generateStartDate combines the `startTime`, and `startDate` into a complete an accurate startDate
 * @param {*} startDate
 * @param {*} startTime
 * @param {*} endTime
 * @returns
 */
export function generateStartDate(startDate, startTime) {
  return moment(startDate)
    .hours(moment(startTime).hours())
    .minutes(moment(startTime).minutes())
    .seconds(0);
}

export function generateSignupsEndDateTime(signupsEndDate, signupsEndTime) {
  return signupsEndDate
    ? moment(signupsEndDate)
        .hours(moment(signupsEndTime).hours())
        .minutes(moment(signupsEndTime).minutes())
        .seconds(0)
    : null;
}
