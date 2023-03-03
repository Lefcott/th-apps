import { Click, Type } from '../interactions';

/**
 * Preview component namespace
 * @prop {string} btn the selector for the Preview Button
 *
 */
export const P = {
  btn: `#CR_previewBtn`,
};

/**
 * This abstracts the actions relating to Previewing a slideshow
 * @namespace Preview
 */
export default class Preview {
  /**
   * Method to Preview slides
   */
  static preview = () => Click.on(P.btn)
}

