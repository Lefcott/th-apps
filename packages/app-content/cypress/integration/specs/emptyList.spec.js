/** @format */

/// <reference types="Cypress" />

//import { List, LI } from '../components';
import ListElements from '../components/page-elements/list/elements';
import { Verify } from '../assertions';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import FakeFeed from '../utils/FakeFeed';

context('Empty List', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
  });

  it('Verify the returning an empty feed body shows the "No Posts" image', function () {
    FakeFeed.empty();
    Verify.theElement(ListElements.noPosts).isVisible();
  });

  it('Verify the returning an non-empty feed body doesnt show the "No Posts" image', function () {
    FakeFeed.notEmpty();
    Verify.theElement(ListElements.noPosts).doesntExist();
  });
});
