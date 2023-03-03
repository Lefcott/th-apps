import { Click } from '../interactions';

/**
 * Shapes Tool component namespace
 * @prop {string} button the selector for the Shapes Tool button
 *
 */
export const ST = {
  button: `#editor__tile-shapes`,
  rectangleBtn: `[ng-click="$ctrl.addShape('rectangle')"]`,
  circleBtn: `[ng-click="$ctrl.addShape('circle')"]`,
  backBtn: `#default_back_btn`,
  deleteBtn: `[ng-click="$ctrl.removeElement()"]`,
  rectangle: `rect`,
  canvas: `.slides > .present`,
};

/**
 * This abstracts the actions relating to the ShapesTool
 * @namespace ShapesTool
 */
export default class ShapesTool {
  /**
   * Method to open the Shapes Tool panel
   */
  static open = () => Click.on(ST.button)

  /**
   * Method to add a rectangle to the canvas
   */
  static addRectangle = () => Click.on(ST.rectangleBtn)

  /**
   * Method to open the shape Tool panel
   */
  static open = () => Click.on(ST.button)

  /**
   * Method to exit out of shape tool view
   */
  static goBack = () => Click.on(ST.backBtn)

   /**
   * Method to delete the first shape that we find
   */
  static deleteElement = () => {
    Click.on(ST.canvas) //not ideal but will fix later.
    Click.on(ST.rectangle)
    Click.on(ST.deleteBtn)
  }
}

