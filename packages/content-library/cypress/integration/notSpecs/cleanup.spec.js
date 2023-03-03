/// <reference types="Cypress" />

import { Filter, Toolbar, MoreInfoModal, ContentCard } from '../components';
import { Sections } from '../components/Sections';
import DeleteContent from '../utils/DeleteContent';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
const url = Cypress.env('CYPRESS_BASE_URL')[Cypress.env('ENVIRONMENT')];

context('photos tests', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(url);
  });

  it('should delete all the photos', function () {
    Filter.theView().toCommunityContent();
    Sections.showAll.photos();
    Verify.theElement('.css-1cpey75').isntVisible();
    DeleteContent();
  });

  it('should delete all the designs', function () {
    Filter.theView().toCommunityContent();
    Sections.showAll.designs();
    Verify.theElement('.css-1cpey75').isntVisible();
    DeleteContent();
  });
});
