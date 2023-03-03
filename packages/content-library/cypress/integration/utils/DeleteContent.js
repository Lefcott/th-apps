import { ContentCard, CC, Filter } from '../components';
import Verify from '../assertions/Verify';
import { Sections } from '../components/Sections';
import { T } from '../components';
let loader = '#CL_contentGrid-loader';
let nores = '#CL_noResults';
let limit = 3;
const DeleteContent = () => {
  //wait for the placeholders to go away, ie. events have loaded
  cy.get(loader).should('have.length', 0);

  cy.wait(100);
  cy.get('body').then($b => {
    let noResults = $b.find(nores).length > 0;
    if (noResults) {
      //this is dumb but makes test pass once there is no content
      cy.get(nores);
      return;
    } else {
      ContentCard.deleteContent();
      let isErr = $b.find(T.errorToast).length > 1;
      // try to fix what's going on by refreshing if it fails
      if (isErr) {
        limit--;
        cy.reload();
        Filter.theView().toCommunityContent();
        Sections.showAll.photos();
      } else {
        limit = 3;
      }
      if (limit > 0) {
        DeleteContent();
      } else {
        throw new Error('somethings wrong, stuff will not delete correctly');
      }
    }
  });
};

export default DeleteContent;
