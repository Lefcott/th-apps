//** @format */
/**
 * This abstracts the actions relating to test assertions
 * @namespace Verify
 * @example Verify.theElement('LOGIN_BTN_SELECTOR').contains('Login')
 */
export default class Verify {
  /**
   * We pass the element into here and it returns functions we can call to assert the
   * element is behaving like its supposed to
   * @example Click.on(somethingThatDisablesBTN)
   * Verify.theElement('BTN').hasClass('Mui-Disabled')
   * @param {string} sel selector for the element you want to run an assertion against
   */
  static theElement = (sel, alias) => ({
    contains: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('contain.text', text),
    hasValue: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.value', text),
    doesntContain: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('not.contain.text', text),
    // make a distincion between element having class and an elements child containing class
    hasClass: (cls) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.class', cls),
    appearsNTimes: (n) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.length', n),
    isVisible: () =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('be.visible'),
    isDisabled: () =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.class', 'Mui-disabled'),
    isNthElementPresent: (num, text) =>
      cy
        .get(sel)
        .eq(num)
        .as(alias || sel)
        .should('contain.text', text),
  });

  /**
   * Static method for specific validation actions against toasts.
   * Dismisses toasts after verification so they don't cover elements we need to interact with.
   * Verify that a toast shows up containing the text passed in
   * @example Verify.theToast.showsUpWithText('content created')
   * @param {string} text text you want to make sure is included in the toast message
   */
  static theToast = {
    showsUpWithText: (text) => {
      cy.get(T.containing(text)).should('be.visible');
    },
    doesntShowUpWithText: (text) => {
      cy.get(T.containing(text)).should('not.be.visible');
    },
  };

  /**
   * Static method for specific validation actions against text.
   * @example Verify.thisText('big long string').contains('string') // assertion passes
   * @example Verify.thisText('big long string').equals('string') // assertion fails
   * @param {string} textToTest text you want to make sure contains other string
   */
  static thisText = (textToTest) => ({
    contains: (textItShouldContain) =>
      expect(textToTest).to.contain(textItShouldContain),
    equals: (textItShouldEqual) => expect(textToTest).to.eq(textItShouldEqual),
  });
  /**
   * Static method for specific validation actions against URLs.
   * @example Verify.theUrl('www.google.com/#fooBar').inclues('#fooBar') // assertion passes
   * @param {string} textToTest text you want to make sure contains other string
   */
  static theUrl = () => ({
    includes: (text) => cy.url().should('include', text),
    EqualsTo: (url) => cy.url().should('eq', url),
  });
  /**
   * Static method for validating text in list of elements
   * @example Verify.list(elements,arrayOfData) // assertion passes
   * @param {List of Elements} elements - the selector may return one or list of elements
   * @param {arr} arr - text that is expected to present in list of elements
   */
  static list = (elements, arr) => {
    cy.get(elements).each((ele, index) => {
      expect(ele).to.contain(arr[index]);
    });
  };
}
