/** @format */

/// <reference types="Cypress" />

import { Demo, DE, HP } from '../components';
import { Click, Verify } from '../interactions';
import Login from '../utils/Login';
import { urlOptions } from '../utils/UrlUtils';

context('Demo Test', function () {
  beforeEach(() => {
    Login.asUser('richard').toDefaultCommunity();
    cy.visit('/', urlOptions);
  });

  it('Is boilerplate you know?', function () {
    console.log(this.user);
    Click.on(HP.selectedCommunity);
    Verify.theElement(HP.selectedCommunity).contains('DO NOT USE');
  });
});
