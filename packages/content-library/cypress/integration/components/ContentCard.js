import { Click, Type } from '../interactions';

/**
 * Content Card component namespace, these are the cards that make up the library
 * @prop {function} card the selectors for the view filter
 * @prop {string} moreInfo the selectors for more info button on the top left of the card
 * @prop {object} cardMenu the selectors for the card menu and its options in the top right of the card
 *
 */
export const CC = {
  cardNamed: (contentName) => `.CL_card:contains("${contentName}")`,
  card: `.CL_card`,
  cardName: `.CL_card-contentName`,
  moreInfoBtn: '.CL_card-moreInfo',
  cardMenu: {
    btn: '.CL_card-menuList',
    listItem: '.CL_card-menuList-listItem',
    editInCreator: '.CL_card-menuList-editCreator',
    pubApp: '.CL_card-menuList-publishApp',
    pubSign: 'CL_card-menuList-publishSignage',
    print: '.CL_card-menuList-print',
    rename: {
      btn: '.CL_card-menuList-rename',
      input: '.CL_card-popoverName input',
      submit: '.CL_card-popoverSubmit',
      cancel: '.CL_card-popoverCancel',
    },
    delete: {
      btn: '.CL_card-menuList-delete',
      submit: '#CL-delete-modal-submit',
      cancel: '#CL-delete-modal-cancel',
    },
  },
};

/**
 * This abstracts the actions relating to the ContentCard
 * @namespace ContentCard
 */
export default class ContentCard {
  /**
   * Method to open the more info modal about a piece of content
   */
  static getMoreInfoAbout = (contentName) => {
    cy.get(CC.cardNamed(contentName))
      .first()
      .within(($card) => {
        Click.on(CC.moreInfoBtn);
      });
  };

  /**
   * Method to edit a piece of content in the creator
   */
  static editInCreator = (contentName) => {
    clickFirstContentMenuBtn(contentName);
    Click.on(CC.cardMenu.editInCreator);
  };

  /**
   * Method to publish a piece of content to the member app
   */
  static publishToApp = (contentName) => {
    clickFirstContentMenuBtn(contentName);
    Click.on(CC.cardMenu.pubApp);
  };

  /**
   * Method to publish a piece of content to digital signage
   */
  static publishToSignage = (contentName) => {
    clickFirstContentMenuBtn(contentName);
    Click.on(CC.cardMenu.pubSign);
  };

  /**
   * Method to print a piece of content
   */
  static print = (contentName) => {
    clickFirstContentMenuBtn(contentName);
    Click.on(CC.cardMenu.print);
  };

  /**
   * Method to rename a piece of content
   */
  static renameContentFrom = (contentName) => {
    clickFirstContentMenuBtn(contentName);
    Click.on(CC.cardMenu.rename.btn);
    return {
      toNewName: (newName) => {
        Type.theText(newName).into(CC.cardMenu.rename.input);
        Click.on(CC.cardMenu.rename.submit);
      },
    };
    // });
  };

  /**
   * Method to delete a piece of content
   */
  static deleteContent = (contentName) => {
    clickFirstContentMenuBtn(contentName);
    Click.forcefullyOn(CC.cardMenu.delete.btn);
    Click.forcefullyOn(CC.cardMenu.delete.submit);
  };
}

let clickFirstContentMenuBtn = (contentName) => {
  if (contentName) {
    cy.get(CC.cardNamed(contentName)).first().find(CC.cardMenu.btn).click();
  } else {
    cy.get(CC.card).first().find(CC.cardMenu.btn).click();
  }
};
