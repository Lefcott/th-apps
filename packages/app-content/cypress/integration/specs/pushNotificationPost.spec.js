/** @format */

/// <reference types="Cypress" />

//import { PostModal, SN, Searchbar, FI, FeedItem } from '../components';
import PostModal from '../components/page-handler/post-modal';
import { Verify } from '../assertions';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import { DateTime } from 'luxon';

context('Push Notification Tests', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.reload();
  });

  it.skip('Create a new post with a notification', function () {
    //skipped until we can pull in eslys code and actually validate
    let post = new Post(
      'TestPost with push notification',
      'Cypress',
      'desc.',
      null,
      null,
      null,
      ['CTG'],
      true
    );

    PostModal.makeNewPost(post);
  });

  it.skip('Make sure a post that start date in future can have notification added', function () {
    //skipped until we can pull in eslys code and actually validate
  });

  it.skip('Make sure a post with start date in past cant have notifications added to it', function () {
    //skipped until we can pull in eslys code and actually validate
  });
});
