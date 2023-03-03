/// <reference types="Cypress" />

import { Canvas, TextTool, TT } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';

context('Text tests!', function() {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Canvas.waitUntilLoaded()
  });

  it('Should add a text box, type into it, then delete it', function () {
    let TEST_TEXT = 'test';
    TextTool.open()
    TextTool.editTextBox(TEST_TEXT)
    Verify.theElement(TT.textboxWithText(TEST_TEXT)).isVisible()
    TextTool.deleteElement()
    Verify.theElement(TT.textboxWithText(TEST_TEXT)).doesntExist()
  });
});
