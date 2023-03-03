/** @format */

/// <reference types="Cypress" />

//import { Post, PostModal, SN, Searchbar, FI, FeedItem } from '../components';
import { Post } from '../components/page-handler/post-modal';
import PostModal from '../components/page-handler/post-modal';
import Searchbar from '../components/page-handler/search-bar';
import FeedItem from '../components/page-handler/feed-item';
import SnackbarElements from '../components/page-elements/snack-bar/elements';
import FeedItemElements from '../components/page-elements/feed-item/elements';
import { Verify } from '../assertions';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import { DateTime } from 'luxon';

let todaysFormattedDate = DateTime.local().toLocaleString(
  { day: '2-digit' },
  DateTime.DATE_MED
);

context('Post tests', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.reload();
  });

  it('Create a basic post', function () {
    let post = new Post(
      'TestPost',
      'Cypress',
      'desc.',
      null,
      null,
      null,
      ['CTG'],
      ['All Care Settings'],
      false
    );
    PostModal.makeNewPost(post);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Searchbar.searchFor(post.title);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    FeedItem.endItemNamed(post.title);
    Verify.theElement(FeedItemElements.endDate).contains(todaysFormattedDate);
  });

  it('Edit an existing post', function () {
    let editedTitle = `Test Post ${Date.now().toString().slice(-5)} - Edited`;
    let post = new Post(
      'TestPost',
      'Cypress',
      'desc.',
      null,
      null,
      null,
      ['CTG'],
      ['All Care Settings'],
      false
    );
    PostModal.makeNewPost(post);
    PostModal.editPostNamed(post.title).withNewTitle(editedTitle).save();
    Searchbar.searchFor(editedTitle);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    FeedItem.endItemNamed(editedTitle);
    Verify.theElement(FeedItemElements.endDate).contains(todaysFormattedDate);
  });

  it('Create a post with photo link in the photo category', function () {
    let link =
      'https://upload.wikimedia.org/wikipedia/commons/f/f1/Lone_Cypress_Sunset.JPG';
    let post = new Post(
      'TestPost',
      'Cypress',
      'desc.',
      null,
      link,
      'Photo',
      ['CTG'],
      ['All Care Settings'],
      false
    );
    PostModal.makeNewPost(post);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Searchbar.searchFor(post.title);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    FeedItem.endItemNamed(post.title);
    Verify.theElement(FeedItemElements.category).contains(post.category);
    Verify.theElement(FeedItemElements.endDate).contains(todaysFormattedDate);
  });

  it('Create a post with a file tag it as a resource', function () {
    let file = 'testcal.pdf';
    let post = new Post(
      'TestPhotoPost',
      'Cypress',
      'desc.',
      file,
      null,
      'Resource',
      ['CTG'],
      ['All Care Settings'],
      false
    );
    PostModal.makeNewPost(post);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Searchbar.searchFor(post.title);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    FeedItem.endItemNamed(post.title);
    Verify.theElement(FeedItemElements.endDate).contains(todaysFormattedDate);
  });

  it('Create a post with Independent Living as care setting ', function () {
    let post = new Post(
      'TestPost',
      'Cypress',
      'desc.',
      null,
      null,
      null,
      ['CTG'],
      ['Independent Living'],
      false
    );
    PostModal.makeNewPost(post);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Searchbar.searchFor(post.title);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    FeedItem.endItemNamed(post.title);
    Verify.theElement(FeedItemElements.endDate).contains(todaysFormattedDate);
  });

  it('Create a post with Indepenedent Living, Assisted Living and Skilled Nursing as care setting ', function () {
    let post = new Post(
      'TestPost',
      'Cypress',
      'desc.',
      null,
      null,
      null,
      ['CTG'],
      ['Independent Living', 'Assisted Living', 'Skilled Nursing'],
      false
    );
    PostModal.makeNewPost(post);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Searchbar.searchFor(post.title);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    FeedItem.endItemNamed(post.title);
    Verify.theElement(FeedItemElements.endDate).contains(todaysFormattedDate);
  });

  it('Create a post with Assisted Living as care setting', function () {
    let post = new Post(
      'TestPost',
      'Cypress',
      'desc.',
      null,
      null,
      null,
      ['CTG'],
      ['Assisted Living'],
      false
    );
    PostModal.makeNewPost(post);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Searchbar.searchFor(post.title);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    FeedItem.endItemNamed(post.title);
    Verify.theElement(FeedItemElements.endDate).contains(todaysFormattedDate);
  });
});
