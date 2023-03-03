/** @format */

/// <reference types="Cypress" />

import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import {
  ResidentListItem,
  RLI,
  Searchbar,
  FormEdit,
  SB,
  SM,
  FilterBy,
} from '../components';

context('Tests around the resident directory Main Page', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Verify.theElement(RLI.loader).isVisible();
    Verify.theElement(RLI.loader).doesntExist();
  });

  it('Should not be able to click out of new/edit resident card C4224', () => {
    Searchbar.searchFor('NewName Lastname');
    ResidentListItem.selectTheOneNamed('NewName Lastname').first();

    Verify.theElement(SB.backdrop).hasCSSProp('visibility').withValue('hidden');
    Verify.theElement(SB.backdrop)
      .doesntHaveCSSProp('visibility')
      .withValue('visible');
    FormEdit.edit();
    Verify.theElement(SB.backdrop)
      .hasCSSProp('visibility')
      .withValue('visible');
    Verify.theElement(SB.backdrop)
      .doesntHaveCSSProp('visibility')
      .withValue('hidden');
  });

  it('Click Resident Management in the left navigation options - C1274', function () {
    Verify.theElement(SM.residentsBtn).contains('Residents');
  });

  it('Search resident list - C1325', function () {
    Verify.theElement(SM.residentsBtn).contains('Residents');
    Searchbar.searchFor('qW123!"·$%&/()=?¿;:');
    Verify.theElement(SB.resultText).contains('Search: qW123!"·$%&/()=?¿;:');
  });

  it('Scroll resident list - C1326', function () {
    cy.get(SB.residentsContainer).scrollTo('bottom');
  });

  it('Filter Resident List by Care Setting  - C24580', function () {
    FilterBy.searchFor('Independent');
    FilterBy.searchFor('Assisted');
    FilterBy.searchFor('Memory_Care');
    FilterBy.searchFor('Skilled_Nursing');
  });
});
