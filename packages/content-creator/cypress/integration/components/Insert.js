import { Click, Type } from '../interactions';

/**
 * Insert component namespace
 * @prop {string} btn the selector for the Slide Insert Button
 *
 */
export const IN = {
  btn: `#CR_insertBtn`,
  searchbar: '#DesignSelection-search',
  testDesignToInsert: 'p:contains("Roboto")',
  testSlideToInsert: 'img[title="Page 1"]',
  confirmInsert: '#PhotoModal-submit',
  insertedText: 'span:contains("Almost before we knew it, we had left the ground.")',
};

/**
 * This abstracts the actions relating to using Insert
 * @namespace Insert
 */
export default class Insert {
  /**
   * Method to open the Insert dropdown
   */
  static open = () => Click.on(IN.btn)

  /**
   * Method to open the Insert dropdown
   */
  static insertSlideNamed = (name) => {
    Type.theText(name).into(IN.searchbar)
    Click.on(IN.testDesignToInsert)
    Click.on(IN.testSlideToInsert)
    Click.on(IN.confirmInsert)
  }
}

