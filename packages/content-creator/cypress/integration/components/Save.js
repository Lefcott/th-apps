import { Click, Type } from '../interactions';

/**
 * Save component namespace
 * @prop {string} btn the selector for the Save Button
 *
 */
export const S = {
  btn: `#CR_saveBtn`,
};

/**
 * This abstracts the actions relating to Saving a slideshow
 * @namespace Save
 */
export default class Save {
  /**
   * Method to Save slides
   */
  static save = () => Click.on(S.btn)
}

