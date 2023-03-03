/** @format */

import { Click, Type } from "../interactions";
import Verify from "../assertions/Verify";

/**
 * Canvas component namespace
 *
 */
export const CA = {
  canvasBackground: '#zoom-item',
	slideBackground: `.slide-background`,
	loadedSlideBackground: '.slide-background[data-loaded="true"]',
	reorderBtn: `#CR_ReOrder-button`,
	moveBtn: `#CR_ReOrder-move-btn`,
	slideInput: `#CR_ReOrder-slideNum-input`,
	cancelBtn: `#creator_ReOrderCancel-button`,
	prevSlide: `.navigate-left`,
	nextSlide: `.navigate-right`,
	addSlide: `.page__add > .page__add--icon`,
  pageNumbers: `.page__numbers`,
  button: `#creator_deletePage-button`,
  confirmButton: `.button__delete:contains("Delete Page")`,
  cancelButton: `#creator_deletePageCancel-button`,
};

/**
 * This abstracts the actions relating to the Canvas
 * @namespace Canvas
 */
export default class Canvas {
	/**
	 * Method to block until the canvas is loaded
	 */
	static waitUntilLoaded = () => {
		cy.log("Waiting for page to be visually ready");
    // Verify.theElement(CA.loadedSlideBackground).isVisible();
    Verify.theElement(CA.canvasBackground).isVisible()
		Click.longWaitClickOn(CA.loadedSlideBackground);
  };
  
   /**
   * Method to delete a page
   */
    static removeSlide = () => {
      Click.on(CA.button);
      Click.on(CA.confirmButton);
    }
  
    /**
     * Method to delete a specfic page given the page number
     */
    static numbered = () => {
      Click.on(CA.button);
      Click.on(CA.confirmButton);
    }

	/**
	 * Method to navigate to a specfic page given the page number
	 */
	static movePageToNumber = (n) => {
		Click.on(CA.reorderBtn);
		Type.theText(1).into(CA.slideInput);
		Click.on(CA.moveBtn);
	};

	/**
	 * Method to add a page to the slideshow
	 */
	static addSlide = () => Click.on(CA.addSlide);
}
