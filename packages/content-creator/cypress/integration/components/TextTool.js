import { Verify } from '../assertions';
import { Click, Type } from '../interactions';

/**
 * Text Tool component namespace
 * @prop {string} button the selector for the Text Tool button
 *
 */
export const TT = {
  button: `#editor__tile-text`,
  backBtn: `.tiles__text [ng-click="$ctrl.back()"]`,
  textbox: `[ng-dblclick="$ctrl.editorInit($event)"]`,
  placeholder: `[data-placeholder="Enter Text Here"]`,
  deleteBtn: `[ng-click="$ctrl.removeElement()"]`,
  canvas: `.slides > .present`,
  textboxWithText: (text)=> `p:contains("${text}")`,
};

/**
 * This abstracts the actions relating to the TextTool
 * @namespace TextTool
 */
export default class TextTool {
  /**
   * Method to open the Text Tool panel
   */
  static open = () => Click.on(TT.button)

  /**
   * Method to exit out of text tool view
   */
  static goBack = () => Click.on(TT.backBtn)

  /**
   * Method to edit the text of a text box
   */
  static editTextBox = (text) => {
    Verify.theElement(TT.placeholder).isVisible()
    Type.theText(text).intoCanvasTextbox(TT.textbox)
  }
  
  /**
   * Method to delete the first text box that we find
   */
  static deleteElement = () => {
    Click.on(TT.canvas) //not ideal but will fix later.
    Verify.theElement('.cke_editable').doesntExist()
    Click.on(TT.textbox)
    Click.on(TT.deleteBtn)
  } 
}
