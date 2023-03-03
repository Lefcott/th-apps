/** @format */

/// <reference types="Cypress" />

import { Click, Upload } from '../interactions';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import {
  ResidentListItem,
  PersonalInfoPanel,
  CRB,
  RLI,
  FE,
  AAM,
  Searchbar,
} from '../components';

import { UrlOptions } from '../utils/SetupBrowser';
import { v4 as uuid } from 'uuid';

context('Tests around personal info', function () {
  let email = `j.s.${Date.now().toString().slice(-9)}@mail.com`;
  let email2 = `b.v${uuid()}@mail.com`;
  let email3 = `b.v${uuid()}@gmail.com`;
  let email4 = `b.v${uuid()}@hotmail.com`;
  let email5 = `j.s.${Date.now().toString().slice(-9)}@aol.com`;
  let lastName = `${Date.now()
    .toString()
    .slice(-9)
    .split('')
    .map((n) => String.fromCharCode(97 + Number(n)))
    .join('')}`;

  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Verify.theElement(RLI.loader).isVisible();
    Verify.theElement(RLI.loader).doesntExist();
    Verify.theElement(RLI.listItem).isVisible();
  });

  it('New resident - required info (personal information panel) - C1328', () => {
    PersonalInfoPanel.create({
      firstName: 'Newman',
      lastName,
      address: 'deletetestdelete',
      email,
      gender: 'Male',
      careSetting: 'Independent',
    });
    Searchbar.searchFor('Newman ' + lastName);
    Verify.theElement(RLI.named('Newman ' + lastName)).isVisible();
    Verify.theElement(RLI.movePending).isVisible();
    Verify.theElement(RLI.address).contains('deletetestdelete');
    //need to finish move in with api call. (currently happens in ops)
  });

  it('Upload new resident photo C1336', () => {
    Searchbar.searchFor('Newman ' + lastName);
    Verify.theElement(RLI.named('Newman ' + lastName)).isVisible();
    Upload.theFile('testphoto.png').into(FE.photoUpload);
  });

  it('Edit resident photo C1337', () => {
    Searchbar.searchFor('Newman ' + lastname);
    Verify.theElement(RLI.named('Newman ' + lastName)).isVisible();
    Upload.theFile('testphoto2.png').into(FE.photoUpload);
  });

  it('New resident - non-required info (personal information panel) - C1330', () => {
    PersonalInfoPanel.create({
      firstName: 'George',
      lastName,
      address: 'deletetestdelete',
      gender: 'Male',
      careSetting: 'Assisted',
      email: email2,
      birthday: '05131976',
      primPhone: '2122217493',
      secPhone: '2122217693',
      building: 'Nakatomi Tower',
    });
    Searchbar.searchFor('George ' + lastName);
    Verify.theElement(RLI.named('George ' + lastName)).isVisible();
    Verify.theElement(RLI.movePending).isVisible();
    Verify.theElement(RLI.address).contains('deletetestdelete');
  });

  it('New resident - non-required info (More Information and Preferences panels) C1862', () => {
    PersonalInfoPanel.create({
      firstName: 'Kramer',
      lastName: lastName,
      address: 'deletetestdelete',
      gender: 'Male',
      careSetting: 'Assisted',
      email: email3,
      birthday: '05131976',
      primPhone: '2122217493',
      secPhone: '2122217693',
      building: 'Nakatomi Tower',
      residenceType: 'Studio',
      moveInDate: '13052021',
      toggleAlert: 'yes',
    });
    Searchbar.searchFor('Kramer ' + lastName);
    Verify.theElement(RLI.named('Kramer ' + lastName)).isVisible();
    Verify.theElement(RLI.movePending).isVisible();
    Verify.theElement(RLI.address).contains('deletetestdelete');
  });

  it('Edit resident - required info (personal information panel) C1329', () => {
    Searchbar.searchFor('Newman ' + lastName);
    ResidentListItem.selectTheOneNamed('Newman ' + lastName);
    PersonalInfoPanel.edit({
      firstName: 'Jerry',
      lastName: lastName,
      moveInDate: null,
      gender: 'Female',
      careSetting: 'Memory_Care',
    });
    Searchbar.searchFor('Jerry ' + lastName);
    Verify.theElement(RLI.named('Jerry ' + lastName)).isVisible();
  });

  it('Edit resident - non-required info (personal information panel) C1331', () => {
    Searchbar.searchFor('George ' + lastName);
    ResidentListItem.selectTheOneNamed('George ' + lastName);
    PersonalInfoPanel.edit({
      firstName: null,
      lastName: null,
      address: null,
      gender: null,
      careSetting: null,
      email: email4,
      birthday: '10141980',
      primPhone: '2122217494',
      secPhone: '2122217694',
      building: 'Burj Khalifa',
    });
    Searchbar.searchFor('George ' + lastName);
    Verify.theElement(RLI.named('George ' + lastName)).isVisible();
  });

  it('Edit resident - non-required info (more information and preferences panel) C1863', () => {
    Searchbar.searchFor('George ' + lastName);
    ResidentListItem.selectTheOneNamed('George ' + lastName);
    PersonalInfoPanel.edit({
      firstName: null,
      lastName: null,
      address: null,
      gender: null,
      careSetting: null,
      email: null,
      birthday: null,
      primPhone: null,
      secPhone: null,
      building: null,
      residenceType: 'Condo',
      moveInDate: '14062021',
      toggleAlert: 'yes',
    });
    Searchbar.searchFor('George ' + lastName);
    Verify.theElement(RLI.named('George ' + lastName)).isVisible();
  });

  it.skip('Move Resident C1338', () => {
    // Skipped for now as testing involves using resident webapp
  });

  it('Get code to onboard Resident to app  C1339', () => {
    Verify.theElement(RLI.firstResOptions).isVisible();
    Click.on(RLI.firstResOptions);
    Click.on(RLI.getAppCode);
    Verify.theElement(AAM.code).isVisible();
    Click.on(AAM.doneBtn);
  });

  it('New Resident - Values with spaces at the end are trimmed - C21794', () => {
    PersonalInfoPanel.create({
      firstName: 'Elaine ',
      lastName: lastName + ' ',
      address: 'deletetestdelete',
      email5,
      gender: 'Male',
      careSetting: 'Independent',
    });
    Searchbar.searchFor('Elaine ' + lastName);
    Verify.theElement(RLI.named('Elaine ' + lastName)).isVisible();
  });

  it('Required fields in the form - C1340', () => {
    Click.on(CRB.button);
    /* ==== Generated with Cypress Studio ==== */
    cy.get(
      '#Rm_Panel-personal-content > .rd-MuiAccordionDetails-root > .rd-MuiGrid-container > :nth-child(1) > .rd-MuiFormControl-root > .rd-MuiFormLabel-root',
    ).should('have.text', 'First Name *');
    cy.get(
      '#Rm_Panel-personal-content > .rd-MuiAccordionDetails-root > .rd-MuiGrid-container > :nth-child(2) > .rd-MuiFormControl-root > .rd-MuiFormLabel-root',
    ).should('have.text', 'Last Name *');
    cy.get(
      ':nth-child(3) > .rd-MuiFormControl-root > .rd-MuiFormLabel-root',
    ).should('have.text', 'Address *');
    cy.get(
      ':nth-child(9) > .rd-MuiFormControl-root > .rd-MuiFormLabel-root',
    ).should('have.text', 'Gender *');
    cy.get(
      ':nth-child(10) > .rd-MuiFormControl-root > .rd-MuiFormLabel-root',
    ).should('have.text', 'Care Setting *');
    /* ==== End Cypress Studio ==== */
  });
});
