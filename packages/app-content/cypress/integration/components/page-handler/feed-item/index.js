/** @format */

import { Click } from '../../../interactions';
import FeedItemElements from '../../page-elements/feed-item/elements';

/**
 * This abstracts the actions relating to a Feed Item
 * @namespace FeedItem
 */
export default class FeedItem {
  /**
   * Method to edit a feed item given a name
   */
  static editItemNamed = (name) => {
    Click.on(FeedItemElements.moreMenu.selector);
    Click.on(FeedItemElements.moreMenu.edit);
  };

  /**
   * Method to end a feed item given a name
   */
  static endItemNamed = (name) => {
    Click.on(FeedItemElements.moreMenu.selector);
    Click.on(FeedItemElements.moreMenu.end);
    Click.on(FeedItemElements.moreMenu.endBtn);
  };
}
