/// <reference types="Cypress" />

import { Canvas, LineTool, LT } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';

context('Line tests!', function() {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Canvas.waitUntilLoaded()
  });

  it('Should add a line, then delete it', function () {
    LineTool.open()
    LineTool.goBack()
    Verify.theElement(LT.line).isVisible()
    LineTool.deleteElement()
    Verify.theElement(LT.line).doesntExist()
  });
});
