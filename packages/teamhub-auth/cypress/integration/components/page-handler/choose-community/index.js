/** @format */

import { Click, Type } from '../../../interactions';
import ChooseCommunityElements from '../../page-elements/choose-community-page/elements';

/**
 * This abstracts the actions relating to theChooseCommunityPage
 * @namespaceChooseCommunityPage
 */
export default class ChooseCommunityComponent {
  /**
   * Method to choose community
   * as of now we are working on only single community "DO NOT USE - Automated Dashboard Test"
   * this can be changed to choose community from community dropdown in community page and the click on go
   */
  static selectCommunityAndLogin = (communityName) => {
    Type.theText(communityName + '{downarrow}{enter}').into(
      ChooseCommunityElements.communityDropdown,
    );
    Click.on(ChooseCommunityElements.goBtn);
  };
}
