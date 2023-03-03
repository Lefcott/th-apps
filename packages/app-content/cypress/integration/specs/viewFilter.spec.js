/** @format */

/// <reference types="Cypress" />

//import { AudienceFilter, ViewFilter } from '../components';
import AudienceFilter from '../components/page-handler/audience-filter';
import ViewFilter from '../components/page-handler/view-filter';
import { Verify } from '../assertions';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import { Pick } from '../utils/GraphUtil';
import GroupPosts from '../utils/GroupPosts';

context('Post List Filters', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Pick('getFeedItems').justToAliasAs('getFeedItems');
  });

  it('Should filter view to upcoming', function () {
    cy.wait('@getFeedItems').then(() => {
      ViewFilter.filterTo().upcoming();
      cy.wait('@getFeedItems').then((feedItems) => {
        let posts = feedItems.response.body.data.community.feed.posts;
        let upcomingPosts = GroupPosts.byView(posts).upcoming;
        Verify.theArray(upcomingPosts).isntEmpty();
      });
    });
  });

  it('Should filter view to active', function () {
    cy.wait('@getFeedItems').then(() => {
      ViewFilter.filterTo().upcoming();
      cy.wait('@getFeedItems').then((feedItems) => {
        ViewFilter.filterTo().active();
        cy.wait('@getFeedItems').then((feedItems) => {
          let posts = feedItems.response.body.data.community.feed.posts;
          let activePosts = GroupPosts.byView(posts).active;
          Verify.theArray(activePosts).isntEmpty();
        });
      });
    });
  });

  it('Should filter view to ended', function () {
    cy.wait('@getFeedItems').then(() => {
      ViewFilter.filterTo().ended();
      cy.wait('@getFeedItems').then((feedItems) => {
        let posts = feedItems.response.body.data.community.feed.posts;
        let endedPosts = GroupPosts.byView(posts).ended;
        Verify.theArray(endedPosts).isntEmpty();
      });
    });
  });
});
