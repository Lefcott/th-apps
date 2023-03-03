import { Click } from '../interactions';

/**
 * Create Resident Button component namespace
 *
 */
export const CRB = {
  button: '#Rm_Create-resident'
};

/**
 * This abstracts the actions relating to the CreateResidentBtn
 * @namespace CreateResidentBtn
 */
export default class CreateResidentBtn {
  /**
   * Method to search for text
   */
  static create = () => Click.on(CRB.button);
}
