/// <reference types="Cypress" />

import { Filter, Toolbar, MoreInfoModal, ContentCard } from '../components';
import { CC, LM, T, F, MIM } from '../components';
import { Sections } from '../components/Sections';
import { Click, Type } from '../interactions';
import Verify from '../assertions/Verify';
import { TEST_PHOTO, Z_TEST_PHOTO } from '../utils/Consts';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';

context('document tests', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.reload();
    Filter.theView().toCommunityContent();
    Sections.showAll.photos();
    // Verify.theElement('.css-1cpey75').isntVisible();
  });

  it('should upload a photo', () => {
    Verify.theElement('#fileUpload').isntVisible();
    Toolbar.uploadPhoto(TEST_PHOTO);
    Verify.theElement(LM.modal).isVisible();
    // Verify.theElement(LM.modal).isntVisible();
    // Verify.theElement(T.successToast).isVisible();
    Verify.theElement(CC.cardName).contains(TEST_PHOTO);
  });

  it('should upload a second photo, filter by date, see new photo first', () => {
    Toolbar.uploadPhoto(Z_TEST_PHOTO);
    Verify.theElement(LM.modal).isVisible();
    // Verify.theElement(LM.modal).isntVisible();
    // Verify.theElement(T.successToast).isVisible();
    Filter.theSort().toDate.desc();
    Verify.theElement(CC.cardName).hasItsFirstElContain(Z_TEST_PHOTO);
  });

  it('should filter by name Z-A see new photo first', () => {
    Filter.theSort().toName.z2a();
    Verify.theElement(CC.cardName).hasItsFirstElContain(Z_TEST_PHOTO);
  });

  it('should rename a photo than change the name back', () => {
    ContentCard.renameContentFrom(Z_TEST_PHOTO).toNewName('a');
    Verify.theElement(CC.cardNamed('a')).isVisible();
    ContentCard.renameContentFrom('a').toNewName(Z_TEST_PHOTO);
    Verify.theElement(CC.cardNamed(Z_TEST_PHOTO)).isVisible();
  });

  it('Should find the photo we uploaded via search', function () {
    Filter.theSearch(TEST_PHOTO);
    Verify.theElement(CC.cardName).contains(TEST_PHOTO);
  });

  it('Should open the more info modal for photos and verify contents', function () {
    Click.onFirst(CC.moreInfoBtn);
    Verify.theElement(MIM.contentName).contains(TEST_PHOTO);
    MoreInfoModal.close();
  });

  it('should delete both photos to clean up', function () {
    ContentCard.deleteContent(Z_TEST_PHOTO);
    cy.get(T.toast).should(
      'have.text',
      'Your content was successfully deleted'
    );
    cy.wait(500);
    ContentCard.deleteContent(TEST_PHOTO);
    cy.get(T.toast).should(
      'have.text',
      'Your content was successfully deleted'
    );
    Verify.theElement('#CL_noResults').isVisible();
  });
});
