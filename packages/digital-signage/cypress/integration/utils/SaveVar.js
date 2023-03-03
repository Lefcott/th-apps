/**
 * This abstracts the actions relating to saving text as variables
 *
 * @format
 * @namespace SaveVar
 */

export default class SaveVar {
  /**
   * We pass the element into here and it returns functions we can call to assert the
   * element is behaving like its supposed to
   * @example SaveVar.theTextOf('elementSelector').as('variableName');
   * @param {function} theTextOf selector for the element you want to run an assertion against
   */
  static theTextOf = (sel) => ({
    as: (varName) => cy.get(sel).first().invoke('text').as(varName),
  });
}
