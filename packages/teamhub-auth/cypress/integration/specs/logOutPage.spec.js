/** @format */

/// <reference types="Cypress" />

import LogoutComponent from '../components/page-handler/logout';
import HomeComponent from '../components/page-handler/home';
import LoginComponent from '../components/page-handler/login';
import CommunityComponent from '../components/page-handler/choose-community';
import { USERS } from '../utils/Consts';
import { urlOptions } from '../utils/UrlUtils';
//logout method
context('TeamHub logout tests!', function () {
  beforeEach(() => {
    cy.visit('/login', urlOptions);
  });

  it('Should be able to logout from dashboard -C677', function () {
    LoginComponent.validatePageLogo();
    LoginComponent.login(USERS.RICHARD.EMAIL, USERS.RICHARD.PASSWORD);
    CommunityComponent.selectCommunityAndLogin(USERS.RICHARD.COMMUNITY_NAME);
    HomeComponent.isHomePageLoaded(
      USERS.ALICIBILLY.WELCOME_MESSAGE,
      USERS.ALICIBILLY.COMMUNITY_NAME,
    );
    LogoutComponent.logout();
    LoginComponent.isLoginPageLoaded();
  });
});
