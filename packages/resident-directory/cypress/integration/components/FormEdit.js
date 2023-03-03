/** @format */

import { Click } from '../interactions';

/**
 * Form edit buttons component namespace
 *
 */
export const FE = {
  editBtn: '#Rm_Form-edit',
  saveBtn: '#Rm_Form-save',
  cancelBtn: '#Rm_Form-cancel',
  photoUploadbtn: '#Rm_Form-photoUpload',
  photoUpload: '#raised-button-file',
  personalInfo: '#Rm_Panel-personal-header > .rd-MuiButtonBase-root',
};

/**
 * This abstracts the actions relating to the buttons on the bottom of the form
 * @namespace FormEdit
 */
export default class FormEdit {
  /**
   * Method to put the form into edit mode
   */
  static edit = () => Click.on(FE.editBtn);
  /**
   * Method to save changes to the form
   */
  static save = () => Click.on(FE.saveBtn);
  /**
   * Method to cancel changes made to the form
   */
  static cancel = () => Click.on(FE.cancelBtn);

  static uploadPhoto = () => {
    cy.get(FE.photoUpload).attachFile({
      filePath: './',
      filename: 'testphoto.png',
      mimeType: 'image/png',
    });
    cy.wait(500);
  };
}
