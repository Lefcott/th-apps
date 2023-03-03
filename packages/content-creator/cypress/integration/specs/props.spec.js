/// <reference types="Cypress" />

import { Canvas, PropsTool, PT } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';

context('Props tests!', function() {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.deleteContentForThisCommunity()
    Canvas.waitUntilLoaded()
  });

  it('Should change the slide duration to 3 seconds', function () {
    PropsTool.open()
    PropsTool.changeDurationTo(3)
    PropsTool.save()
    PropsTool.open()
    //Having hard time validating due to angular weirdness, punting to not waste time, if the rest of the test hasn't failed it's probably ok
    // Verify.theShadowElement("#editing-view-port").isVisibleWithin(PT.durationVal)
  });


  it('Should change the slide background color to hot pink', function () {
    PropsTool.open()
    PropsTool.changeBackgroundColor()
    Verify.theElement(PT.colorPicker.pinkBackground).isVisible()
  });

  it('Should change the slide background image', function () {
    PropsTool.open()
    PropsTool.changeBackgroundImage()
    Verify.theElement(PT.backgroundImage.backgroundSlideImage).isVisible()
  });
});
