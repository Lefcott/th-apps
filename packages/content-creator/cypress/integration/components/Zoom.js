import { Click, Type } from '../interactions';

/**
 * Zoomcomponent namespace
 * @prop {string} in the selector for Zoom in button
 * @prop {string} out the selector for Zoom out button
 * @prop {string} reset the selector for Zoom reset button
 *
 */
export const Z = {
  in: `#CR_zoom-in`,
  out: '#CR_zoom-out',
  reset: '#CR_zoom-reset',
};

/**
 * This abstracts the actions relating to the Zoom
 * @namespace Zoom *
 * */
export default class Zoom {
  /**
   * Method to zoom to a percentage
   */
  static to = (n) => Click.on(Z.in);
}
