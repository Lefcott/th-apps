import { Canvas, Templates, TP } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';


context('Template tests!', function() {
  beforeEach(() => {
    Auth.user();
    UrlOptions.qs.communityId = 14
    cy.visit(UrlOptions);
    Canvas.waitUntilLoaded()
  });

    it('Should create a slide with the birthday template', function () {
      Templates.open()
      Templates.useBirthdayTemplate()
      Verify.theElement(TP.birthdaySlideImage).isVisible()
    });
  });

