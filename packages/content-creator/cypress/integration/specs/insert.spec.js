import { Canvas, Insert, IN } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';


context('Insert tests!', function() {
  beforeEach(() => {
    Auth.user();
    UrlOptions.qs.communityId = 14
    cy.visit(UrlOptions);
    Canvas.waitUntilLoaded()
  });


    it('Should create a slide by inserting it using the insert tool', function () {
      Insert.open()
      Insert.insertSlideNamed('Roboto')
      Verify.theElement(IN.insertedText).isVisible()
    });

    
  });

