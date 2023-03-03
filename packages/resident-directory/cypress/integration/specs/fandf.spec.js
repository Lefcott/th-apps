/** @format */

/// <reference types="Cypress" />

import { Click } from '../interactions';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import {
  FP,
  FamilyPanel,
  AddFamilyModal,
  LinkFamilyModal,
  RLI,
  T,
} from '../components';
import { UrlOptions } from '../utils/SetupBrowser';
import EditFamilyModal from '../components/EditFamilyModal';

context('Friends and family tests', function () {
  let email = `j.s.${Date.now().toString().slice(-9)}@email.com`;
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Verify.theElement(RLI.loader).isVisible();
    Verify.theElement(RLI.loader).doesntExist();
  });

  it('Add new Friends & Family member - C1341', () => {
    FamilyPanel.SearchAndSelect('Newman');
    AddFamilyModal.add('Jeb', 'Smith', 'Son', email, '2122217493');
    //Verify.theElement(FP.familyMember).isVisible();
  });
  it('Edit Friends & Family member - C1334', () => {
    FamilyPanel.SearchAndSelect('Newman');
    EditFamilyModal.edit('Juan', 'Salvo', null, null, '2122216739');
  });
  /**
   * Next Test is failing bug created
   * https://k4connect.atlassian.net/browse/K4CAR-2853
   */
  it('Link Residents C4220', () => {
    FamilyPanel.SearchAndSelect('Newman');
    LinkFamilyModal.link('a a');
  });
  /**
   * This validates all fields not just phone number
   */
  it('Add Friends & Family member with incorrect phone number format - C4083', () => {
    FamilyPanel.SearchAndSelect('Newman');
    cy.get(FP.familyAddBtn).click();
    AddFamilyModal.validations();
  });

  it('Validate fields when editing a friend or fanily member - C24596', () => {
    FamilyPanel.SearchAndSelect('Newman');
    cy.get(FP.menu.menu).first().click();
    cy.get(FP.menu.edit).first().click();
    EditFamilyModal.validations();
  });

  it('Resend email invitation to Friends & Family member - C4216', () => {
    FamilyPanel.SearchAndSelect('Newman');
    cy.get(FP.menu.menu).first().click();
    Click.on(FP.menu.invite);
    Verify.theElement(T.toast).contains(
      'has been resent an invitation to the K4Community app',
    );
  });

  it('Get code to onboard Friends & Family member to app - C4208', () => {
    FamilyPanel.SearchAndSelect('Newman');
    cy.get(FP.menu.menu).first().click();
    Click.on(FP.menu.code);
    Verify.theElement(FP.activationCodeText).contains('App Activation Code');
    Verify.theElement(FP.activationCodeCode).isVisible();
    Click.on(FP.activationCodeDoneBtn);
    Verify.theElement(FP.activationCodeText).doesntExist();
  });

  it('Remove Friends & Family member - C4209', () => {
    FamilyPanel.SearchAndSelect('Newman');
    FamilyPanel.delete('Newman', 'Jerry Smith');
  });
});
