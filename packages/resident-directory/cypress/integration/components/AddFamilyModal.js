/** @format */

import { Click, Type } from '../interactions';
import { FP, T } from './';
import Verify from '../assertions/Verify';

/**
 * Add family modal component namespace
 *
 */
export const AFM = {
  modal: '#Rm_addFamilyModal',
  firstName: '#Rm_addFamilyModal input[name="firstName"]',
  lastName: '#Rm_addFamilyModal input[name="lastName"]',
  lastNameHelperText:
    ':nth-child(2) > .rd-MuiFormControl-root > .rd-MuiFormHelperText-root',
  relationship: {
    dropdown: '#mui-component-select-relationship',
    named: (relationshipTitle) => `li[data-value="${relationshipTitle}"]`,
    helperText:
      ':nth-child(3) > .rd-MuiFormControl-root > .rd-MuiFormHelperText-root',
  },
  email: '#Rm_addFamilyModal input[name="email"]',
  emailHelperText:
    ':nth-child(1) > .rd-MuiFormControl-root > .rd-MuiFormHelperText-root',
  phone: '#Rm_addFamilyModal input[name="primaryPhone"]',
  submitBtn: '#Rm_addFamilyModal-save',
  cancelBtn: '#Rm_addFamilyModal-cancel',
};

/**
 * This abstracts the actions relating to the add family modal
 * @namespace AddFamilyModal
 */
export default class AddFamilyModal {
  /**
   * Method to add a friend or family member
   */
  static add = (firstName, lastName, relationship, email, phone) => {
    Click.on(FP.familyAddBtn);
    Type.theText(firstName).into(AFM.firstName);
    Click.on(AFM.submitBtn);
    Verify.theElement(AFM.lastNameHelperText).contains(
      'Must enter a last name',
    );
    Verify.theElement(AFM.relationship.helperText).contains(
      'Must select a relationship',
    );
    Verify.theElement(AFM.emailHelperText).contains('Must enter a valid email');
    Type.theText(lastName).into(AFM.lastName);
    Click.on(AFM.relationship.dropdown),
      Click.on(AFM.relationship.named(relationship));
    Type.theText(email).into(AFM.email);
    if (phone) Type.theText(phone).into(AFM.phone);
    Click.on(AFM.submitBtn);
    Verify.theElement(T.toast).contains(
      firstName + ' ' + lastName + ' has been invited to the K4Community app',
    );

    Click.on(T.toastDismiss);
  };
  static validations = () => {
    cy.get(AFM.submitBtn).click();
    cy.contains('Must enter a first name');
    cy.contains('Must enter a last name');
    cy.contains('Must select a relationship');
    cy.contains('Must enter a valid email');
    Type.theText('Ricardo').into(AFM.firstName);
    cy.get(AFM.submitBtn).click();
    cy.contains('Must enter a last name');
    cy.contains('Must select a relationship');
    cy.contains('Must enter a valid email');
    Type.theText('Fort').into(AFM.lastName);
    cy.get(AFM.submitBtn).click();
    cy.contains('Must select a relationship');
    cy.contains('Must enter a valid email');
    Click.on(AFM.relationship.dropdown),
      Click.on(AFM.relationship.named('Grandson'));
    cy.get(AFM.submitBtn).click();
    cy.contains('Must enter a valid email');
    Type.theText('ponges.gmail@com').into(AFM.email);
    cy.get(AFM.submitBtn).click();
    cy.contains('email must be a valid email');
    Type.theText('ponges@gmail.com').into(AFM.email);
    Type.theText('999999999').into(AFM.phone);
    cy.get(AFM.submitBtn).click();
  };
}
