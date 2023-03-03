/** @format */

/// <reference types="Cypress" />

//import { AudienceFilter, ViewFilter } from '../components';
import AudienceFilter from '../components/page-handler/audience-filter';
import ViewFilter from '../components/page-handler/view-filter';
import { Verify } from '../assertions';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import { Pick } from '../utils/GraphUtil';
import { pickBy, reject } from 'lodash';

context('Post List Filters', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Pick('getFeedItems').justToAliasAs('getFeedItems');
  });

  it('Should filter audience to resident', function () {
    cy.wait('@getFeedItems').then(() => {
      AudienceFilter.filterTo().resident();
      cy.wait('@getFeedItems').then((feedItems) => {
        let posts = feedItems.response.body.data.community.feed.posts;
        // reject posts that dont include Resident in the audience, we expect an empty array here
        let rejectedForNotHavingAudience = reject(posts, (post) =>
          post.audiences.includes('Resident')
        );
        Verify.theArray(rejectedForNotHavingAudience).isEmpty();
      });
    });
  });

  it('Should filter audience to family', function () {
    cy.wait('@getFeedItems').then(() => {
      AudienceFilter.filterTo().family();
      cy.wait('@getFeedItems').then((feedItems) => {
        let posts = feedItems.response.body.data.community.feed.posts;
        let rejectedForNotHavingAudience = reject(posts, (post) =>
          post.audiences.includes('Family')
        );
        Verify.theArray(rejectedForNotHavingAudience).isEmpty();
      });
    });
  });

  it('Should filter audience to voice', function () {
    cy.wait('@getFeedItems').then(() => {
      AudienceFilter.filterTo().voice();
      cy.wait('@getFeedItems').then((feedItems) => {
        let posts = feedItems.response.body.data.community.feed.posts;
        let rejectedForNotHavingAudience = reject(posts, (post) =>
          post.audiences.includes('ResidentVoice')
        );
        Verify.theArray(rejectedForNotHavingAudience).isEmpty();
      });
    });
  });
});
