/** @format */

import ToolbarElements from '../../page-elements/toolbar/elements';

export default class Toolbar {
  /**
   * Uploads a photo
   * @example Toolbar.uploadPhoto('./photo.png')
   */
  static uploadPhoto(fileName) {
    let filePath = './' + fileName + '.png';
    cy.get(ToolbarElements.uploadInput).attachFile({
      filePath,
      fileName,
      mimeType: 'image/png',
    });
  }

  /**
   * Uploads a pdf
   * @example Toolbar.uploadPdf('./file.pdf')
   */
  static uploadPdf(fileName) {
    let filePath = './' + fileName + '.pdf';

    cy.get(ToolbarElements.uploadInput).attachFile({
      filePath,
      fileName,
      mimeType: 'application/pdf',
    });
  }
}
