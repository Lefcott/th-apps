import { Click, Type } from '../interactions';

/**
 * Undo/Redo component namespace
 * @prop {string} undo the selector for the undo button
 * @prop {string} redo the selector for the redo button
 *
 */
export const UR = {
  undo: `#CR_undoBtn`,
  redo: '#CR_redoBtn',
};

/**
 * This abstracts the actions relating to Undo/Redo
 * @namespace UndoRedo *
 * */
export default class UndoRedo {
  /**
   * Method to undo an action
   */
  static undo = () => Click.on(UR.undo);
  
  /**
   * Method to redo an action
   */
  static redo = () => Click.on(UR.redo);
}
