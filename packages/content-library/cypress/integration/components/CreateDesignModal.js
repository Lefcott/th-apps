/**
 * Create Design Modal component namespace, this is the loading modal with the animated newtons cradle
 * @prop {string} modal the selectors for the modal itself
 *
 */
export const CDM = {
  modal: '#CL_CreateDesignModal',
  name: 'input[name="name"]',
  orienatation: {
    dropdown: '#mui-component-select-orientation',
    portrait: 'span:contains("Portrait")',
    landscape: 'span:contains("Landscape")',
  },
  size: {
    dropdown: '#mui-component-select-size',
    digitalContent: 'span:contains("1920")',
  },
  uploadInput: '#CL_dropzone_input',
  save: '#CL_designModal-save',
};

/**
 * This abstracts the actions relating to the CreateDesignModal
 * @namespace CreateDesignModal
 */
export default class CreateDesignModal {
  /**
   * Method to upload a doc to the cdm
   */
  static uploadDoc = (fileName, fileType) => {
    let filePath = './' + fileName + fileType;
    ('');

    cy.get(CDM.uploadInput).attachFile({
      filePath,
      fileName,
    });
  };
}
