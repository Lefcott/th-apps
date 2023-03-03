/** @format */

import Verify from '../assertions/Verify';
import { Click } from '../interactions';
import { ResidentListItem, Searchbar, FormEdit, T } from '../components';

/**
 * F&F panel component namespace
 *
 */
export const FP = {
  panel: '#Rm_Panel-family-header',
  panelContent: '#Rm_Panel-family-content',
  familyLinkBtn: '#Rm_familyPanel-link',
  familyAddBtn: '#Rm_familyPanel-add',
  familyMember: '.Rm_familyPanel-contact',
  menu: {
    menu: '.Rm_familyPanel-contact-menu',
    edit: '.Rm_familyPanel-contact-edit',
    invite: '.Rm_familyPanel-contact-invite',
    code: '.Rm_familyPanel-contact-code',
    delete: '.Rm_familyPanel-contact-delete',
    deleteModalConfirm: '#Rm_deleteModal-submit',
  },
  activationCodeText: '.rd-MuiDialogTitle-root > .rd-MuiTypography-root',
  activationCodeDoneBtn: '.rd-MuiDialogActions-root > .rd-MuiButtonBase-root',
  activationCodeCode:
    '.rd-MuiDialog-root > div.rd-MuiDialog-container.rd-MuiDialog-scrollPaper > div > div.rd-MuiDialogContent-root > h2',
  noFamilyText:
    '[style="max-height: 200px; overflow: auto;"] > .rd-MuiTypography-root',
};

/**
 * This abstracts the actions relating to the F&F Panel
 * @namespace FamilyPanel
 */
export default class FamilyPanel {
  /**
   * Method to open the FamilyPanel
   */
  static open = () => {
    cy.wait(1000);
    Click.on(FP.panel);
    Verify.theElement(FP.panelContent).isVisible();
  };

  /**
   * Method to delete someone
   */
  static delete = (residentName, contactName) => {
    //refactor soon
    cy.get(FP.menu.menu).first().click();
    cy.get(FP.menu.delete).first().click();
    cy.get(FP.menu.deleteModalConfirm).click();
    Verify.theElement(T.toast).isVisible();
    //Verify.theElement(T.toast).contains(residentName + "'s contact " + contactName + ' was deleted.',);
    //Click.on(T.toastDismiss);
    Verify.theElement(FP.noFamilyText).contains(
      'No listed friends or family members',
    );
  };
  /**
   * Method to edit a family member
   */
  static edit = (email) => {
    //refactor soon
    cy.get(FP.menu.menu).first().click();
    cy.get(FP.menu.edit).first().click();

    //Verify.theElement(T.toast).isVisible();
    //Verify.theElement(T.toast).contains(residentName+"'s contact "+contactName+' was deleted.');
    //Click.on(T.toastDismiss);
  };
  /**
   * Method to select a familiy member and prepare for editing
   */
  static SearchAndSelect = (name) => {
    Searchbar.searchFor(name);
    ResidentListItem.getFirst();
    FamilyPanel.open();
    FormEdit.edit();
  };
}
