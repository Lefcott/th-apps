/** @format */

/// <reference types="Cypress" />

import { ListFilter, LF } from '../components';
import { Click, Type, Verify } from '../interactions';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import { Pick } from '../utils/GraphUtil';

context('Sinage List Filters', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Pick('getFeedItems').justToAliasAs('getFeedItems');
  });

  it.only('Should filter sort to ascending', function () {
    Click.on(LF.sort.selector);
    Click.on(LF.sort.dateAsc);
    Verify.theElement(LF.sort.selector).contains('Edited Date: Asc');
  });

  it('Should search for a doc that doesnt exist and get the appropriate error message', function () {
    let badTitle = "I can't imagine anything has this title";
    Type.theText(badTitle).into(LF.searchbar.selector);
    Verify.theElement(LF.noResultsMsg).contains(badTitle);
  });
});
