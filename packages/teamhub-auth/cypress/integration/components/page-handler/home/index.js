/** @format */

import HomePageElements from '../../page-elements/home-page/elements';
import { Verify } from '../../../interactions';

/**
 * This abstracts the actions relating to theChooseCommunityPage
 * @namespaceChooseCommunityPage
 */
export default class HomeComponent {
  static isHomePageLoaded = (welcomeMessage, communityName) => {
    Verify.theElement(HomePageElements.welcomeMessage).contains(welcomeMessage);
    Verify.theElement(HomePageElements.selectedCommunity).contains(
      communityName,
    );
  };
}
