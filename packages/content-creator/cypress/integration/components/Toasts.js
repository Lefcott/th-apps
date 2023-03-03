import { Click, Type } from '../interactions';

/**
 * Toast component namespace
 * @prop {string} button the selector for Toasts
 *
 */
export const T = {
  failure: `.submitToasts--fail`,
  success: '.submitToasts--success',
  warning: '.submitToasts--warn'
};

/**
 * This abstracts the actions relating to the Toasts
 * @namespace Toast
 */
export default class Toast {
  /**
   * Method to open the Toast panel
   */
  static open = () => Click.on(T.button)
}

