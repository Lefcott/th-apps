/** @format */

import { toNumber } from 'lodash';
import moment from 'moment-timezone';
export const minutes = (d) => toNumber(d.format('mm'));
export const hours = (d) => toNumber(d.format('HH'));
export const days = (d) => toNumber(d.format('DD'));
export const months = (d) => d.month();
export const years = (d) => toNumber(d.format('YYYY'));

export const eventFormDateFormat = (d) => d.format('MMDDYYYY');
export const eventFormTimeFormat = (d) => d.format('hhmmA');

export class _Time {
  static hours = (h) => ({ minutes: (m) => moment({ hours: h, minutes: m }) });
}

export class _Date {
  static year = (y) => ({
    month: (m) => ({ day: (d) => moment({ year: y, month: m, day: d }) }),
  });
}
