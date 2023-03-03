/** @format */

import Verify from '../assertions/Verify';
import { Click, Type } from '../interactions';
import { CRB, FormEdit, T, FE, MIP, MoreInfoPanel, PreferencesPanel } from './';
/**
 * Personal info panel component namespace
 *
 */
export const PIP = {
  panel: '#Rm_Panel-personal',
  firstName: 'input[name="firstName"]',
  lastName: 'input[name="lastName"]',
  address: 'input[name="address"]',
  building: 'input[name="building"]',
  residentMovedBtn: '#Rm_Form-resMoved > .rd-MuiButton-label',
  move: {
    type: '#mui-component-select-moveType',
    typeOptiion1: '.rd-MuiList-root > [tabindex="0"]',
    reason: '#mui-component-select-reason',
    reasonOption1: '.rd-MuiList-root > [tabindex="0"]',
    newAdress: '.rd-MuiDialogContent-root > :nth-child(4)',
    date:
      '.rd-MuiDialogContent-root > .rd-MuiTextField-root > .rd-MuiInputBase-root > .rd-MuiInputBase-input',
    save: '#Rm_Move-save',
  },
  helperText: {
    firstName:
      '#Rm_Panel-personal-content > div > div > div:nth-child(1) > div > p',
    lastName:
      '#Rm_Panel-personal-content > div > div > div:nth-child(2) > div > p',
    address:
      '#Rm_Panel-personal-content > div > div > div:nth-child(3) > div > p',
    careSetting:
      '#Rm_Panel-personal-content > div > div > div:nth-child(10) > div > p',
  },
  phonePrimary: 'input[name="primaryPhone"]',
  phoneSecondary: 'input[name="secondaryPhone"]',
  email: 'input[name="email"]',
  birthday: '#Rm_residentBirthday-input',
  gender: {
    dropdown: '#Rm_residentGender-input',
    gender: (g) => `[data-value="${g}"]`,
    male: '[data-value="Male"]',
    female: '[data-value="Female"]',
  },
  careSetting: {
    dropdown: '#Rm_residentCareSetting-input',
    option: (o) => `[data-value="${o}"]`,
    input: '#Rm_residentCareSetting-input-select',
    helperText: '#Rm_residentCareSetting-input > p',
    errorMessage: 'Must provide a care setting',
  },
};

/**
 * This abstracts the actions relating to the PersonalInfoPanel
 * @namespace PersonalInfoPanel
 */
export default class PersonalInfoPanel {
  /**
   * Method to open the PersonalInfoPanel
   */
  static open = () => Click.on(PIP.panel);

  /**
   * Method to add new resident
   */
  static create = ({
    firstName,
    lastName,
    address,
    gender,
    careSetting,
    email,
    birthday,
    primPhone,
    secPhone,
    building,
    residenceType,
    moveInDate,
    toggleAlert,
  }) => {
    Click.on(CRB.button);
    //this.verifyRequiredFieldsCreate();

    Type.theText(firstName).into(PIP.firstName);
    Type.theText(lastName).into(PIP.lastName);
    Type.theText(address).into(PIP.address);
    Click.on(PIP.gender.dropdown);
    Click.on(PIP.gender.gender(gender));
    Click.on(PIP.careSetting.dropdown);
    Click.on(PIP.careSetting.option(careSetting));

    email && Type.theText(email).into(PIP.email);
    birthday && Type.theText(birthday).into(PIP.birthday);
    primPhone && Type.theText(primPhone).into(PIP.phonePrimary);
    secPhone && Type.theText(secPhone).into(PIP.phoneSecondary);
    building && Type.theText(building).into(PIP.building);
    residenceType && Click.on(MIP.panel);
    residenceType && MoreInfoPanel.changeResidenceTypeTo(residenceType);
    residenceType && Click.on(MIP.panel);
    moveInDate && MoreInfoPanel.changeMoveInDate();
    toggleAlert && PreferencesPanel.open();
    toggleAlert && PreferencesPanel.toggle();
    FormEdit.save();
  };

  static verifyCreationSucceeded = (firstName, lastName) => {
    Verify.theElement(T.toast).isVisible();
    Verify.theElement(T.toast).contains(
      firstName + ' ' + lastName + ' was successfully added.',
    );
  };

  static verifyEditsSucceeded = (firstName, lastName) => {
    Verify.theElement(T.toast).contains(
      'Changes were successfully made for ' + firstName + ' ' + lastName + '.',
    );
  };

  static checkFieldFailedValidation = (field) => {
    Verify.theElement(PIP[field].helperText).contains(PIP[field].errorMessage);
  };

  /**
   * Method to changeCareSetting
   */
  static changeCareSetting = (careSetting) => {
    Click.on(PIP.careSetting.dropdown);
    Click.on(PIP.careSetting.option(careSetting));
    Verify.theElement(PIP.careSetting.input).hasValue(careSetting);
  };

  /**
   * Method to add edit resident info
   */
  static edit = ({
    firstName,
    lastName,
    address,
    gender,
    careSetting,
    email,
    birthday,
    primPhone,
    secPhone,
    building,
    residenceType,
    moveInDate,
    toggleAlert,
  }) => {
    Click.on(PIP.panel);
    FormEdit.edit();
    firstName && Type.theText(firstName).into(PIP.firstName);
    lastName && Type.theText(lastName).into(PIP.lastName);
    //not using address for now as code from plus app needed to confirm preexisting address
    address && Click.on(PIP.residentMovedBtn);
    address && Click.on(PIP.move.type);
    address && Click.on(PIP.move.typeOptiion1);
    address && Click.on(PIP.move.reason);
    address && Click.on(PIP.move.reasonOption1);
    address && Type.theText(address).into(PIP.move.newAdress);
    address && Click.on(PIP.move.save);
    gender && Click.on(PIP.gender.dropdown);
    gender && Click.on(PIP.gender.gender(gender));
    careSetting && Click.on(PIP.careSetting.dropdown);
    careSetting && Click.on(PIP.careSetting.option(careSetting));
    email && Type.theText(email).into(PIP.email);
    if (gender) {
      Click.on(PIP.gender.dropdown);
      Click.on(PIP.gender.gender(gender));
    }

    if (careSetting) {
      this.changeCareSetting(careSetting);
    }
    birthday && Type.theText(birthday).into(PIP.birthday);
    primPhone && Type.theText(primPhone).into(PIP.phonePrimary);
    secPhone && Type.theText(secPhone).into(PIP.phoneSecondary);
    building && Type.theText(building).into(PIP.building);
    residenceType && Click.on(MIP.panel);
    residenceType && MoreInfoPanel.changeResidenceTypeTo(residenceType);
    residenceType && Click.on(MIP.panel);
    moveInDate && MoreInfoPanel.changeMoveInDate();
    toggleAlert && PreferencesPanel.open();
    toggleAlert && PreferencesPanel.toggle();
    FormEdit.save();
    Verify.theElement(T.toast).isVisible();
    Verify.theElement(T.toast).contains('Changes were successfully made for ');
  };
  /**
   * Method to verify Resident info cannot be saved with empty required fields
   */
  static verifyRequiredFieldsCreate() {
    Click.on(CRB.button);
    Type.theText('FirstName').into(PIP.firstName);
    FormEdit.save();
    Verify.theElement(PIP.helperText.lastName).contains(
      'lastName is a required field',
    );
    Verify.theElement(PIP.helperText.address).contains(
      'Must enter address for new resident',
    );
    Verify.theElement(PIP.helperText.careSetting).contains(
      'Must provide a care setting',
    );
    cy.get(PIP.firstName).clear();
    Verify.theElement(PIP.helperText.firstName).contains(
      'firstName is a required field',
    );
    Verify.theElement(PIP.helperText.careSetting).hasClass('Mui-error');
  }
}
