/// <reference types="Cypress" />

import { Filter, ContentCard, CreateDesignModal } from '../components';
import { CC, CDM, T, TB } from '../components';
import { Sections } from '../components/Sections';
import { Click, Type } from '../interactions';
import { TEST_WORD_DOC_NAME } from '../utils/Consts';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';

context('designs tests', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.reload();
    Filter.theView().toCommunityContent();
    Sections.showAll.designs();
  });

  it('Should upload a ppt', function () {
    Click.on(TB.createDesignBtn);
    Type.theText(TEST_WORD_DOC_NAME).into(CDM.name);
    Click.on(CDM.orienatation.dropdown);
    Click.on(CDM.orienatation.landscape);
    Click.on(CDM.size.dropdown);
    Click.on(CDM.size.digitalContent);
    CreateDesignModal.uploadDoc(TEST_WORD_DOC_NAME, '.doc');
    Click.on(CDM.save);
  });

  it('Should find the document we uploaded via search', function () {
    Filter.theSearch(TEST_WORD_DOC_NAME);
    Verify.theElement(CC.cardName).contains(TEST_WORD_DOC_NAME);
  });

  it('should delete a document', function () {
    ContentCard.deleteContent(TEST_WORD_DOC_NAME);
    // Verify.theElement(T.containing('successfully')).isVisible();
    Verify.theElement('#CL_noResults').isVisible();
  });
});
