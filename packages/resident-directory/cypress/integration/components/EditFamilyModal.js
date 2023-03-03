/** @format */

import { Click, Type } from '../interactions';
import { FP, T, AFM } from './';
import Verify from '../assertions/Verify';

/**
 * Add family modal component namespace
 *
 */
export const EFM = {
  modal: '#Rm_addFamilyModal',
  firstName: '#Rm_addFamilyModal input[name="firstName"]',
  lastName: '#Rm_addFamilyModal input[name="lastName"]',
  relationship: {
    dropdown: '#mui-component-select-relationship',
    named: (relationshipTitle) => `li[data-value="${relationshipTitle}"]`,
  },
  email: '#Rm_addFamilyModal input[name="email"]',
  phone: '#Rm_addFamilyModal input[name="primaryPhone"]',
  submitBtn: '#Rm_addFamilyModal-save',
  cancelBtn: '#Rm_addFamilyModal-cancel',
};

/**
 * This abstracts the actions relating to the add family modal
 * @namespace EditFamilyModal
 */
export default class EditFamilyModal {
  /**
   * Method to add a friend or family member
   */
  static edit = (firstName, lastName, relationship, email, phone) => {
    cy.get(FP.menu.menu).first().click();
    cy.get(FP.menu.edit).first().click();
    if (firstName) Type.theText(firstName).into(EFM.firstName);
    if (lastName) Type.theText(lastName).into(EFM.lastName);
    if (relationship)
      Click.on(EFM.relationship.dropdown),
        Click.on(EFM.relationship.named(relationship));
    if (email) Type.theText(email).into(EFM.email);
    if (phone) Type.theText(phone).into(EFM.phone);
    Click.on(EFM.submitBtn);
    Verify.theElement(T.toast).contains(
      ' contact information has been updated',
    );
  };
  static validations = () => {
    cy.get(AFM.firstName).clear();
    cy.get(AFM.lastName).clear();
    cy.get(AFM.email).clear();
    cy.get(AFM.submitBtn).click();
    cy.contains('Must enter a first name');
    cy.contains('Must enter a last name');
    cy.contains('Must enter a valid email');
    Type.theText('Ricardo').into(AFM.firstName);
    cy.get(AFM.submitBtn).click();
    cy.contains('Must enter a last name');
    cy.contains('Must enter a valid email');
    Type.theText('Fort').into(AFM.lastName);
    cy.get(AFM.submitBtn).click();
    cy.contains('Must enter a valid email');
    Click.on(AFM.relationship.dropdown),
      Click.on(AFM.relationship.named('Grandson'));
    cy.get(AFM.submitBtn).click();
    cy.contains('Must enter a valid email');
    Type.theText('ponges.gmail@com').into(AFM.email);
    cy.get(AFM.submitBtn).click();
    cy.contains('email must be a valid email');
    Type.theText('ponges@gmail.com').into(AFM.email);
    Type.theText('5555555555').into(AFM.phone);
    cy.get(AFM.submitBtn).click();
    cy.contains("Phone number isn't valid");
  };
}
