/// <reference types="Cypress" />

import { Canvas, CA } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';

context('Page adding and reordering', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Canvas.waitUntilLoaded()
  });

  it('Should add a page, then remove it', function () {
    Canvas.addSlide();
    Verify.theElement(CA.pageNumbers).contains('2/2');
    Canvas.removeSlide();
    Verify.theElement(CA.pageNumbers).contains('1/1');
  });

  it('Should add a page, then re-order them', function () {
    Canvas.addSlide();
    Verify.theElement(CA.pageNumbers).contains('2/2');
    Canvas.movePageToNumber(1)
    Verify.theElement(CA.pageNumbers).contains('1/2');
  });
});
