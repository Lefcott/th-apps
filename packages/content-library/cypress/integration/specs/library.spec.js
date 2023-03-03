import { Filter } from '../components';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
context('library tests', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.reload();
  });

  it('Should filter the view to community content', function () {
    Filter.theView().toCommunityContent();
  });
});
