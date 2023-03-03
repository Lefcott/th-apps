import { toNumber } from 'lodash';
export const minutes = (d) => toNumber(d.format('mm'));
export const hours = (d) => toNumber(d.format('HH'));
export const days = (d) => toNumber(d.format('DD'));
export const months = (d) => d.month();
export const years = (d) => toNumber(d.format('YYYY'));


export const eventFormDateFormat = (d) => d.format('MMDDYYYY');
export const eventFormTimeFormat = (d) => d.format('hhmmA')

export class _Time {
  static hours = h => ({ minutes: m => Cypress.moment({ hours: h, minutes: m }) });
}

export class _Date {
  static year = y => ({ month: m => ({ day: d => Cypress.moment({ year: y, month: m, day: d }) }) });
}
 