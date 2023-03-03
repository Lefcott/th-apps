/** @format */

/// <reference types="Cypress" />

import LoginComponent from '../components/page-handler/login';
import HomeComponent from '../components/page-handler/home';
import CommunityComponent from '../components/page-handler/choose-community';
import { USERS } from '../utils/Consts';
import { urlOptions } from '../utils/UrlUtils';

context('TeamHub login tests!', function () {
  beforeEach(() => {
    cy.visit('/login', urlOptions);
  });

  it('Should be able to login using authorized credentials ', function () {
    LoginComponent.validatePageLogo();
    LoginComponent.login(USERS.RICHARD.EMAIL, USERS.RICHARD.PASSWORD);
    CommunityComponent.selectCommunityAndLogin(USERS.RICHARD.COMMUNITY_NAME);
    HomeComponent.isHomePageLoaded(
      USERS.RICHARD.WELCOME_MESSAGE,
      USERS.RICHARD.COMMUNITY_NAME,
    );
  });

  it('Should be able to login using authorized credentials with single community - C652 ', function () {
    LoginComponent.validatePageLogo();
    LoginComponent.login(USERS.ALICIBILLY.EMAIL, USERS.ALICIBILLY.PASSWORD);
    HomeComponent.isHomePageLoaded(
      USERS.ALICIBILLY.WELCOME_MESSAGE,
      USERS.ALICIBILLY.COMMUNITY_NAME,
    );
  });

  it('Should show appropriate messages when credentials are not entered - C1782', function () {
    LoginComponent.validatePageLogo();
    LoginComponent.clickOnLoginBtn();
    LoginComponent.validateRequiredFeildMessages();
  });

  it('Should show appropriate error message when unauthorised credentials are entered - C657', function () {
    LoginComponent.validatePageLogo();
    LoginComponent.login(USERS.INVALID.EMAIL, USERS.INVALID.PASSWORD);
    LoginComponent.validateWrongCredentailsMessage();
  });

  it('Should able to change password when forgot password is clicked -C654', function () {
    LoginComponent.validatePageLogo();
    LoginComponent.clickOnForgotPassword();
    LoginComponent.validateEmailMessage();
    LoginComponent.enterforgotEmail(USERS.RICHARD.EMAIL);
    LoginComponent.clickOnsendEmailBtn();
    LoginComponent.validateEmailInstructionsMessage();
  });
});
