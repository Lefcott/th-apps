/**
 * Utility to give us some fake data for cypress
 *
 * @format
 */

import makePostArray from '../../../__tests__/test-utils/createPostArray';
import { Pick } from '../utils/GraphUtil';

export default class FakeFeed {
  static empty = () => {
    Pick('getFeedItems').withFixture('EmptyFeed');
    cy.wait('@getFeedItems');
  };

  static notEmpty = () => {
    cy.fixture('NotEmptyFeed').then((notEmptyFeed) => {
      notEmptyFeed.data.community.feed.posts = makePostArray(3, 'active');
      Pick('getFeedItems').withData(notEmptyFeed);
    });
    cy.wait('@getFeedItems');
  };
}
