import { Click, Type } from '../interactions';

/**
 * Image Tool component namespace
 * @prop {string} button the selector for the Image Tool button
 *
 */
export const IT = {
  button: `#editor__tile-image`,
};

/**
 * This abstracts the actions relating to the ImageTool
 * @namespace ImageTool
 */
export default class ImageTool {
  /**
   * Method to open the Image Tool panel
   */
  static open = () => Click.on(IT.button)
}

