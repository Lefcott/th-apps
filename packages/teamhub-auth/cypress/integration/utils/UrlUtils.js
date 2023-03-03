/** @format */

const env = Cypress.env('ENVIRONMENT');
const qs = Cypress.config('queryParams')[env];
export const urlOptions = { qs };
