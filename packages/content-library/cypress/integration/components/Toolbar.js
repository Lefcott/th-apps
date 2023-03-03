import { Click } from '../interactions';

/**
 * Toolbar component namespace, this is the toolbar on the top of the screen
 * @prop {string} toolbar the selector for the toolbar itself
 * @prop {string} uploadBtn the selector for the upload button on the toolbar
 * @prop {string} uploadInput the selector for the upload input on the toolbar
 * @prop {string} createDesignBtn the selector for the create design button on the toolbar
 * @prop {string} backBtn the selector for the back button on the toolbar
 *
 */
export const TB = {
  toolbar: '#CL_toolbar',
  uploadBtn: `#CL_toolbar-upload`,
  uploadInput: `#fileUpload`,
  createDesignBtn: `#CL_toolbar-design`,
  backBtn: '#CL_toolbar-back',
};

/**
 * This abstracts the actions relating to the content toolbar
 * @namespace Toolbar
 */
export default class Toolbar {
  /**
   * Uploads a photo
   * @example Toolbar.uploadPhoto('./photo.png')
   */
  static uploadPhoto(fileName) {
    let filePath = './' + fileName + '.png';

    cy.get(TB.uploadInput).attachFile({
      filePath,
      filename: `${fileName}.png`,
      mimeType: 'image/png',
    });
  }

  /**
   * Uploads a pdf
   * @example Toolbar.uploadPdf('./file.pdf')
   */
  static uploadPdf(fileName) {
    let filePath = './' + fileName + '.pdf';

    cy.get(TB.uploadInput).attachFile({
      filePath,
      filename: `${fileName}.pdf`,
      mimeType: 'application/pdf',
    });
  }
}
