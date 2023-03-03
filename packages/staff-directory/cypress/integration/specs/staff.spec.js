/** @format */

/// <reference types="Cypress" />

import Verify from '../assertions/Verify';
import { Click, Type } from '../interactions';
import StaffModalElements from '../components/page-elements/staff-modal';
import NavBarElements from '../components/page-elements/nav-bar';
import StaffListItemElements from '../components/page-elements/staff-list-items';
import SearchbarElements from '../components/page-elements/search-bar';
import TabBarElements from '../components/page-elements/top-bar';
import StaffModal from '../components/page-handler/staff-modal';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
const url = Cypress.env('CYPRESS_BASE_URL');
const env = Cypress.env('ENVIRONMENT');
const staffName2 = 'Richard Belding';
const staffJobTitle2 = 'Administrator';
const staffFirstName = 'B1ll';
const staffLastName = 'Cypress!';
const staffEmail = `billium.verylongemail${uuid()}@mail.com`;
const staffEmail2 = `another.verylongemail${uuid()}@mail.com`;
const staffEmail3 = `jillium.verylongemail${uuid()}@mail.com`;
const staffFirstName3 = 'J1ll';
const staffPrimPhone3 = '(919) 445-9996';
const staffSecPhone3 = '(919) 445-9995';
const department = 'Administration';

import { v4 as uuid } from 'uuid';
context('New post tests', function () {
  beforeEach(() => {
    cy.visit(UrlOptions);
    if (env === 'local') {
      cy.reload();
    }
    Auth.user();
  });

  it('Should Make sure Community-Directory link is available in Sidebar', function () {
    cy.viewport(1024, 768);
    Click.on(NavBarElements.navItemAdmin);
    Click.on(NavBarElements.navItemStaffDirectory);
    Verify.theElement(TabBarElements.moduleName).isVisible();
    Verify.theElement(TabBarElements.moduleName).contains('Staff Directory');
  });

  it('Should make a new staff member with basic info, verify staff visibility toggles', function () {
    StaffModal.addStaffMember(
      staffFirstName,
      staffLastName,
      staffEmail,
      null,
      null,
      null,
    );
    cy.get(StaffModalElements.addStaffBtn).should('not.exist');
  });

  it('Should make a new staff member with full info', function () {
    StaffModal.addStaffMember(
      staffFirstName3,
      staffLastName,
      staffEmail3,
      staffJobTitle2,
      staffPrimPhone3,
      staffSecPhone3,
      department,
    );
    cy.get(StaffModalElements.addStaffBtn).should('not.exist');
  });

  it('Should be able to search for staff member using alpha numeric and special characters and validate values in columns', function () {
    Type.theText(staffName2).into(SearchbarElements.toolbarSearch);
    Verify.theElement(StaffListItemElements.listItemNameFirst).contains(
      staffName2,
    );
    Verify.theElement(StaffListItemElements.listItemEmailFirst).contains(
      StaffModalElements.staffEmail2,
    );
    Verify.theElement(StaffListItemElements.listItemJobTitleFirst).contains(
      staffJobTitle2,
    );
    Verify.theElement(StaffListItemElements.listItemPrimPhoneFirst).contains(
      StaffModalElements.staffPrimPhone2,
    );
  });

  it('Should Verify all Community-Directory Columns are visible', function () {
    Verify.theElement(StaffListItemElements.columnName).contains('Name');
    Verify.theElement(StaffListItemElements.columnEmail).contains('Email');
    Verify.theElement(StaffListItemElements.columnJobTitle).contains(
      'Job Title',
    );
    Verify.theElement(StaffListItemElements.columnPrimaryPhone).contains(
      'Primary Phone',
    );
  });

  it('Should let user edit their own staff record', function () {
    Click.on(NavBarElements.userButton);
    Click.on(NavBarElements.userAccount);
    cy.get(StaffModalElements.firstName).clear();
    Type.theText('Joe').into(StaffModalElements.firstName);
    Type.theText('2122210864').into(StaffModalElements.primaryPhone);
    Click.on(StaffModalElements.addStaffBtn);
    cy.get(TabBarElements.notificationBanner).contains(' has been updated');
    Click.on(NavBarElements.userButton);
    Click.on(NavBarElements.userAccount);
    Type.theText('Richard').into(StaffModalElements.firstName);
    cy.get(StaffModalElements.primaryPhone).clear();
    Click.on(StaffModalElements.addStaffBtn);
  });

  it('Should add a profile photo and primary phone to the existing staff member', function () {
    const phoneNumber = '919-445-9999';
    StaffModal.findStaffEdit(staffName2);
    Type.theText(phoneNumber).into(StaffModalElements.primaryPhone);
    StaffModal.uploadPhoto();
    Click.on(StaffModalElements.addStaffBtn);
    cy.get(StaffModalElements.addStaffBtn).should('not.exist');
    cy.get(TabBarElements.notificationBanner).contains(
      staffName2 + ' has been updated',
    );
  });

  it('Should add a Job Title to the existing staff member', function () {
    const jobTitle = 'Adminitrator';
    StaffModal.findStaffEdit(staffEmail);
    Type.theText(jobTitle).into(StaffModalElements.jobTitle);
    Click.on(StaffModalElements.addStaffBtn);
    cy.get(StaffModalElements.addStaffBtn).should('not.exist');
  });

  it('Should add an existing Department to the existing staff member', function () {
    const edepartment = 'Security';
    StaffModal.findStaffEdit(staffName2);
    Type.theText(edepartment).into(StaffModalElements.fieldDepartment);
    Click.on(StaffModalElements.addStaffBtn);
    cy.get(StaffModalElements.addStaffBtn).should('not.exist');
    //remove deparment so it is not assigned for next test
    StaffModal.findStaffEdit(staffName2);
    cy.get(StaffModalElements.fieldDepartment).clear();
    Click.on(StaffModalElements.addStaffBtn);
  });

  it('Should add an NEW Department to the existing staff member', function () {
    const ndepartment = 'NewDepartment';
    StaffModal.findStaffEdit(staffName2);
    Click.on(StaffModalElements.fieldDepartment);
    Type.theText(ndepartment).into(StaffModalElements.fieldDepartment);
    Click.on(StaffModalElements.createDepartment);
    Click.on(StaffModalElements.addStaffBtn);
    cy.get(StaffModalElements.addStaffBtn).should('not.exist');
    //remove deparment so it does not exist in a next test
    StaffModal.findStaffEdit(staffName2);
    cy.get(StaffModalElements.fieldDepartment).clear();
    Click.on(StaffModalElements.addStaffBtn);
  });

  it('Should check values are validated for format or necessary values when editing', function () {
    StaffModal.findStaffEdit(staffName2);
    StaffModal.staffModalValidationsEdit();
    Click.on(StaffModalElements.cancelBtn);
  });

  it('Should check values are validated for format or necessary values when creating a new staff member', function () {
    Click.on(TabBarElements.newStaffBtn);
    StaffModal.staffModalValidationsCreate();
    Click.on(StaffModalElements.cancelBtn);
  });

  it('Should remove other visibility toggles when turnning off make profile public toggle when editing', function () {
    StaffModal.findStaffEdit(staffEmail);
    Click.on(StaffModalElements.makeProfilePublic);
    StaffModal.verifyVisibilityOptions();
  });

  it('Should remove the profile photo', function () {
    StaffModal.findStaffEdit(staffName2);
    StaffModal.removePhoto();
  });

  it('Should show message when clicking send password reset', function () {
    StaffModal.findStaffEdit(staffEmail);
    cy.get(StaffModalElements.sendPasswordHelperText).should('not.exist');
    cy.get(StaffModalElements.sendPasswordReset).check();
    cy.get(StaffModalElements.sendPasswordHelperText).should('exist');
  });

  it('Should update the email of the existing staff member', function () {
    StaffModal.findStaffEdit(staffEmail);
    Type.theText(staffEmail2).into(StaffModalElements.email);
    Click.on(StaffModalElements.addStaffBtn);
    cy.get(StaffModalElements.addStaffBtn).should('not.exist');
  });

  it('Should archive the existing Staff Member', function () {
    StaffModal.removeStaff(staffFirstName + ' ' + staffLastName, staffEmail2);
    //For Both Staff Created
    Click.on(TabBarElements.nBannerdismiss);
    StaffModal.removeStaff(staffFirstName3 + ' ' + staffLastName, staffEmail3);
  });

  it('Should check there are no visibility options in a Community configured not to show them', function () {
    const community = 'Operational Test Bed';
    StaffModal.changeCommunityProgramatically(14);
    StaffModal.findStaffEdit(staffName2);
    Verify.theElement(StaffModalElements.firstName).isVisible();
    Verify.theElement(StaffModalElements.makeProfilePublic).doesntExist();
    Verify.theElement(StaffModalElements.visibleEmail).doesntExist();
    Verify.theElement(StaffModalElements.visiblePhone).doesntExist();
  });
});
