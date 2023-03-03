/** @format */

import { first } from 'lodash';
import { Click, Type } from '../../interactions';
import StaffModalElements from '../page-elements/staff-modal';
import StaffListItemElements from '../page-elements/staff-list-items';
import TabBarElements from '../page-elements/top-bar';
import Searchbar from './search-bar';
import Verify from '../../assertions/Verify';

/**
 * This abstracts the actions relating to the Staff Modal
 * @namespace StaffModal
 */
export default class StaffModal {
  /**
   * Method to make a new staff member
   */
  static addStaffMember = (
    firstName,
    lastName,
    email,
    title,
    primaryPhone,
    secPhone,
    department,
  ) => {
    Click.on(TabBarElements.newStaffBtn);
    Type.theText(firstName).into(StaffModalElements.firstName);
    Type.theText(lastName).into(StaffModalElements.lastName);
    Type.theText(email).into(StaffModalElements.email);
    title && Type.theText(title).into(StaffModalElements.jobTitle);
    primaryPhone &&
      Type.theText(primaryPhone).into(StaffModalElements.primaryPhone);
    secPhone && Type.theText(secPhone).into(StaffModalElements.secondaryPhone);
    department &&
      Type.theText(department)
        .into(StaffModalElements.fieldDepartment)
        .type('{downarrow}')
        .type('{enter}');
    this.verifyVisibilityOptions();
    Click.on(StaffModalElements.addStaffBtn);
    cy.get(TabBarElements.notificationBanner).contains(
      firstName + ' ' + lastName + ' added to directory.',
    );
  };

  static verifyVisibilityOptions = () => {
    cy.get(StaffModalElements.visibleEmail).should('exist');
    cy.get(StaffModalElements.visiblePhone).should('exist');
    Click.on(StaffModalElements.makeProfilePublic);
    cy.get(StaffModalElements.visibleEmail).should('not.exist');
    cy.get(StaffModalElements.visiblePhone).should('not.exist');
  };

  static uploadPhoto = () => {
    cy.get(StaffModalElements.photoUpload).attachFile({
      filePath: './testphoto.png',
      filename: 'testphoto.png',
      mimeType: 'image/png',
    });
    cy.wait(500);
    Click.on(StaffModalElements.confirmCrop);
  };

  static removePhoto = () => {
    Verify.theElement(StaffModalElements.removePhoto).isVisible();
    Click.on(StaffModalElements.removePhoto);
    Verify.theElement(StaffModalElements.addStaffBtn).isVisible();
    Click.on(StaffModalElements.addStaffBtn);
  };

  static findStaffEdit = (value) => {
    Searchbar.searchFor(value);
    cy.wait(1500);
    Click.on(StaffListItemElements.listItemActions).first();
    cy.get(StaffListItemElements.roleMenuItem).contains('Edit').first().click();
  };

  static removeStaff = (value1, value2) => {
    Searchbar.searchFor(value2);
    cy.wait(1500);
    Click.on(StaffListItemElements.listItemActions).first();
    cy.get(StaffListItemElements.roleMenuItem)
      .contains('Remove')
      .first()
      .click();
    Click.on(StaffListItemElements.actionsRemove).first();
    Verify.theElement(TabBarElements.notificationBanner).isVisible();
    cy.get(TabBarElements.notificationBanner).contains(
      value1 + ' removed from directory',
    );
  };

  static changeCommunityManually = (value) => {
    Click.on(StaffModalElements.userButton);
    Click.on(NB.userCommunities);
    Type.theText(value).into(NB.communitySelector);
    Click.on(NB.communitySelector + '-option-0');
    Click.on(NB.confirmCommunity);
  };

  static staffModalValidationsEdit = (value) => {
    cy.get(StaffModalElements.firstName).clear();
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');
    Type.theText(StaffModalElements.staffFirstName2).into(
      StaffModalElements.firstName,
    );
    cy.get(StaffModalElements.addStaffBtn).should('not.be.disabled');

    cy.get(StaffModalElements.lastName).clear();
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');
    Type.theText(StaffModalElements.staffLastName2).into(
      StaffModalElements.lastName,
    );
    cy.get(StaffModalElements.addStaffBtn).should('not.be.disabled');

    cy.get(StaffModalElements.email).clear();
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');
    Type.theText(StaffModalElements.staffEmail2).into(StaffModalElements.email);
    cy.get(StaffModalElements.addStaffBtn).should('not.be.disabled');

    cy.get(StaffModalElements.primaryPhone).clear();
    Type.theText(StaffModalElements.invalidPhone).into(
      StaffModalElements.primaryPhone,
    );
    Click.on(StaffModalElements.addStaffBtn);
    Verify.theElement(StaffModalElements.primaryPhoneHelperText).contains(
      'Primary phone must be a valid phone number.',
    );
    Type.theText(StaffModalElements.staffPrimPhone2).into(
      StaffModalElements.primaryPhone,
    );
    cy.get(StaffModalElements.primaryPhoneHelperText).should('not.exist');

    Type.theText(StaffModalElements.invalidPhone).into(
      StaffModalElements.secondaryPhone,
    );
    Verify.theElement(StaffModalElements.secondaryPhoneHelperText).contains(
      'Secondary phone must be a valid phone number.',
    );
    Type.theText(StaffModalElements.staffPrimPhone2).into(
      StaffModalElements.secondaryPhone,
    );
    cy.get(StaffModalElements.secondaryPhoneHelperText).should('not.exist');

    cy.get(StaffModalElements.email).clear();
    Type.theText(StaffModalElements.invalidEmail).into(
      StaffModalElements.email,
    );
    Verify.theElement(StaffModalElements.emailHelperText).contains(
      'Email must be a valid email address.',
    );
    Type.theText(StaffModalElements.staffEmail2).into(StaffModalElements.email);
    cy.get(StaffModalElements.emailHelperText).should('not.exist');

    cy.get(StaffModalElements.email).clear();
    Type.theText(StaffModalElements.staffEmail4).into(StaffModalElements.email);
    Click.on(StaffModalElements.addStaffBtn);
    Verify.theElement(StaffModalElements.emailHelperText).contains(
      'Email already exists.',
    );
  };
  static staffModalValidationsCreate = (value) => {
    cy.get(StaffModalElements.firstName).clear();
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');
    Type.theText(StaffModalElements.staffFirstName2).into(
      StaffModalElements.firstName,
    );
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');

    cy.get(StaffModalElements.lastName).clear();
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');
    Type.theText(StaffModalElements.staffLastName2).into(
      StaffModalElements.lastName,
    );
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');

    cy.get(StaffModalElements.email).clear();
    cy.get(StaffModalElements.addStaffBtn).should('be.disabled');
    Type.theText(StaffModalElements.staffEmail2).into(StaffModalElements.email);
    cy.get(StaffModalElements.addStaffBtn).should('not.be.disabled');

    cy.get(StaffModalElements.primaryPhone).clear();
    Type.theText(StaffModalElements.invalidPhone).into(
      StaffModalElements.primaryPhone,
    );
    Click.on(StaffModalElements.addStaffBtn);
    Verify.theElement(StaffModalElements.primaryPhoneHelperText).contains(
      'Primary phone must be a valid phone number.',
    );
    Type.theText(StaffModalElements.staffPrimPhone2).into(
      StaffModalElements.primaryPhone,
    );
    cy.get(StaffModalElements.primaryPhoneHelperText).should('not.exist');

    Type.theText(StaffModalElements.invalidPhone).into(
      StaffModalElements.secondaryPhone,
    );
    Verify.theElement(StaffModalElements.secondaryPhoneHelperText).contains(
      'Secondary phone must be a valid phone number.',
    );
    Type.theText(StaffModalElements.staffPrimPhone2).into(
      StaffModalElements.secondaryPhone,
    );
    cy.get(StaffModalElements.secondaryPhoneHelperText).should('not.exist');

    cy.get(StaffModalElements.email).clear();
    Type.theText(StaffModalElements.invalidEmail).into(
      StaffModalElements.email,
    );
    Verify.theElement(StaffModalElements.emailHelperText).contains(
      'Email must be a valid email address.',
    );
    Type.theText(StaffModalElements.staffEmail2).into(StaffModalElements.email);
    cy.get(StaffModalElements.emailHelperText).contains(
      'An e-mail will be sent to this address with instructions on creating a new pasword. This e-mail will expire in 15 minutes.',
    );
    cy.get(StaffModalElements.email).clear();
    Type.theText(StaffModalElements.staffEmail4).into(StaffModalElements.email);
    Click.on(StaffModalElements.addStaffBtn);
    Verify.theElement(StaffModalElements.emailHelperText).contains(
      'Email already exists.',
    );
  };
  static changeCommunityProgramatically = (value) => {
    cy.visit('/community-directory', {
      qs: { communityId: value },
      onLoad: (w) => {
        try {
          w.localStorage.setItem('selectedCommunity', value);
        } catch (err) {
          console.log('___-_-_err_-_-___ :\n\n\n', err, '\n\n');
        }
      },
    });
  };
}
