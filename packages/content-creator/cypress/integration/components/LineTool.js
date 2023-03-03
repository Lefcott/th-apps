import { Click } from '../interactions';

/**
 * Line Tool component namespace
 * @prop {string} button the selector for the Line Tool button
 *
 */
export const LT = {
  button: `#editor__tile-line`,
  backBtn: `#default_back_btn`,
  deleteBtn: `[ng-click="$ctrl.removeElement()"]`,
  line: `line`,
  canvas: `.slides > .present`,
};

/**
 * This abstracts the actions relating to the LineTool
 * @namespace LineTool
 */
export default class LineTool {
  /**
   * Method to open the Line Tool panel
   */
  static open = () => Click.on(LT.button)

  /**
   * Method to add a rectangle to the canvas
   */
  static addRectangle = () => Click.on(LT.rectangleBtn)

  /**
   * Method to open the shape Tool panel
   */
  static open = () => Click.on(LT.button)

  /**
   * Method to exit out of shape tool view
   */
  static goBack = () => Click.on(LT.backBtn)

   /**
   * Method to delete the first shape that we find
   */
  static deleteElement = () => {
    Click.on(LT.canvas) //not ideal but will fix later.
    Click.on(LT.line)
    Click.on(LT.deleteBtn)
  }
}

