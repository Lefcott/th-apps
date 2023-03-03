/** @format */

/// <reference types="Cypress" />

import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import {
  ResidentListItem,
  PreferencesPanel,
  RLI,
  Searchbar,
  FormEdit,
} from '../components';

context('Tests around the resident preferences panel', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Verify.theElement(RLI.loader).isVisible();
    Verify.theElement(RLI.loader).doesntExist();
  });

  it('Edit resident - Preferences - Change Alert Toggle - C24599', () => {
    Searchbar.searchFor('NewName Lastname');
    ResidentListItem.selectTheOneNamed('NewName Lastname').first();
    PreferencesPanel.open();
    FormEdit.edit();
    PreferencesPanel.toggle();
    FormEdit.save();
  });
});
