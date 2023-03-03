/// <reference types="Cypress" />

import { Canvas, ShapesTool, ST } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';

context('Shapes tests!', function() {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Canvas.waitUntilLoaded()
  });

  it('Should add a rectangle, then delete it', function () {
    ShapesTool.open()
    ShapesTool.addRectangle()
    ShapesTool.goBack()
    Verify.theElement(ST.rectangle).isVisible()
    ShapesTool.deleteElement(ST.rectangle)
    Verify.theElement(ST.rectangle).doesntExist()
  });
});
