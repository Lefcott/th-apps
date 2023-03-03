/** @format */

import { Click, Type, Upload } from '../../../interactions';
import Searchbar from '../search-bar';
import { FeedItem } from '../feed-item';
import PostModalElements from '../../page-elements/post-modal/elements';
import FeedItemElements from '../../page-elements/feed-item/elements';
import { Verify } from '../../../assertions';

/**
 * Post class so we can do some things with it, need to probably find
 * a new home for it but we're good here now
 */
export class Post {
  constructor(
    title,
    author,
    description,
    file,
    link,
    category,
    tags,
    careSettings,
    pushNotification
  ) {
    this.title = `${title}-${Date.now().toString().slice(-5)}`;
    this.author = author;
    this.description = description;
    this.file = file;
    this.link = link;
    this.category = category;
    this.tags = tags;
    this.careSettings = careSettings;
    this.pushNotification = pushNotification;
  }

  // could throw a couple a statics in here for ending specific posts but this would be
  // a change in how we think about cypress things. I'm liking it though.
}
export default class PostModal {
  /**
   * Method to make a new post
   */
  static makeNewPost = (Post) => {
    Click.on(PostModalElements.newPostBtn);

    Post.title && editTitle(Post.title);
    Post.author && editAuthor(Post.author);
    Post.description && editDescription(Post.description);
    Post.file && editFile(Post.file);
    Post.link && editLink(Post.link);
    Post.pushNotification && editPushNotification(Post.pushNotification);
    Post.category && editCategory(Post.category);
    Post.tags && editTags(Post.tags);
    Post.careSettings && editCaresettings(Post.careSettings);
    cy.wait(1000);
    Click.on(PostModalElements.postBtn);
  };

  static editPostNamed = (postTitle) => {
    // find the post where the title matches the passed in title
    Searchbar.searchFor(postTitle);
    Verify.theElement(FeedItemElements.feedItem).appearsNTimes(1);
    Verify.theElement(FeedItemElements.feedItemNamed(postTitle)).isVisible();
    // open that post to edit
    Click.on(FeedItemElements.moreMenu.selector);
    Click.on(FeedItemElements.moreMenu.edit);
    return postEditObj;
  };
}
const postEditObj = {
  withNewTitle: (title) => editTitle(title),
  withNewAuthor: (author) => editAuthor(author),
  withNewDescription: (description) => editDescription(description),
  withNewFile: (file) => editFile(file),
  withNewLink: (link) => editLink(link),
  withNewPushNotification: (pushNotification) =>
    editPushNotification(pushNotification),
  withNewCategory: (category) => editCategory(category),
  withNewTags: (tags) => editTags(tags),
  save: () => Click.on(PostModalElements.postBtn),
};

const editTitle = (title) => {
  Type.theText(title).into(PostModalElements.title);
  return postEditObj;
};
const editAuthor = (author) => {
  Click.on(PostModalElements.author.btn);
  Type.theText(author).into(PostModalElements.author.input);
  return postEditObj;
};

const editDescription = (description) => {
  Click.on(PostModalElements.description.btn);
  Type.theText(description).into(PostModalElements.description.input);
  return postEditObj;
};

const editFile = (file) => {
  Click.on(PostModalElements.file.btn);
  Upload.theFile(file).into(PostModalElements.file.input);
  Verify.theElement(PostModalElements.file.uploadedFile).isVisible();
  return postEditObj;
};

const editLink = (link) => {
  Click.on(PostModalElements.link.btn);
  Type.theText(link).into(PostModalElements.link.input);
  return postEditObj;
};

const editPushNotification = (notificationOn) => {
  if (notificationOn) {
    //get empty checkbox and click
    Click.on(PostModalElements.pushNotification.checkbox);
    //make sure text shows up
    Verify.theElement(PostModalElements.pushNotification.helperText).contains(
      'Helper Text String'
    );
  } else {
    //get clicked checkbox
    Click.on(PostModalElements.pushNotification.checkbox);
    //make sure text doesnt show up
    Verify.theElement(
      PostModalElements.pushNotification.helperText
    ).doesntExist();
  }
  return postEditObj;
};

const editCategory = (category) => {
  Type.theText(category + '{downarrow}{enter}').into(
    PostModalElements.category
  );
  return postEditObj;
};

const editTags = (tags) =>
  tags.forEach((tag) => {
    // this will need some loving
    Type.theText(tag + '{downarrow}{enter}').into(PostModalElements.tags.input);
    Verify.theElement(PostModalElements.tags.tag).contains(tag);
    return postEditObj;
  });

const editCaresettings = (careSettings) => {
  if (careSettings[0] == 'All Care Settings') return postEditObj;

  Click.on(PostModalElements.careSettings.dropdownEle);
  Click.on(PostModalElements.careSettings.allCareSettings);
  careSettings.forEach((careSetting) => {
    Click.onContainsText(
      PostModalElements.careSettings.selectCareSetting,
      careSetting
    );
  });
  Click.on('body');
  Verify.list(PostModalElements.careSettings.selectedElements, careSettings);
  return postEditObj;
};
