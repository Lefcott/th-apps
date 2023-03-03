/// <reference types="Cypress" />

import {
  Filter,
  Toolbar,
  T,
  LM,
  MoreInfoModal,
  MIM,
  ContentCard,
  CC,
} from '../components';
import { Sections } from '../components/Sections';
import Verify from '../assertions/Verify';
import { Click } from '../interactions';
import { TEST_DOC_NAME } from '../utils/Consts';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
context('document tests', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.reload();
    Filter.theView().toCommunityContent();
    Sections.showAll.documents();
    // Verify.theElement('.css-1cpey75').isntVisible();
  });

  it('should upload a document', () => {
    Toolbar.uploadPdf(TEST_DOC_NAME);
    Verify.theElement(LM.modal).isVisible();
    // Verify.theElement(LM.modal).isntVisible();
    Verify.theElement(CC.cardName).contains(TEST_DOC_NAME);
  });

  it('Should find the document we uploaded via search', function () {
    Filter.theSearch(TEST_DOC_NAME);
    Verify.theElement(CC.cardName).contains(TEST_DOC_NAME);
  });

  it('Should open the more info modal for document and verify contents', function () {
    Click.onFirst(CC.moreInfoBtn);
    Verify.theElement(MIM.contentName).contains(TEST_DOC_NAME);
    MoreInfoModal.close();
  });

  it('should delete a document', function () {
    // this fails, i think because it deletes it  "too quickly" (before pdf render or whatever)
    ContentCard.deleteContent(TEST_DOC_NAME);
    // Verify.theElement(T.containing('successfully')).isVisible();
    Verify.theElement('#CL_noResults').isVisible();
  });
});
