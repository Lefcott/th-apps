/** @format */

import { Verify } from '../assertions';
import { Click, Type, Upload } from "../interactions";

/**
 * Props Tool component namespace
 * @prop {string} button the selector for the Props Tool button
 *
 */
export const PT = {
  button: `#editor__tile-properties`,
  durationInput: ".pageDuration__input",
  durationVal: "input[ng-model='duration']",
  loadedSlideBackground: '.slide-background[data-loaded="true"]',
  colorPicker: {
    btn: ".color-picker-select",
    hotPink: 'span[title="#ff00ff"]',
    pinkBackground: '[data-background-color="#ff00ff"]',
  },
  backgroundImage: {
    btn: '.background__upload',
    emptyImagePlaceholderMessage: 'p:contains("No photos available in Community Content.")',
    uploadedPhoto: '[id^=Photos-Card-]', //syntax for id that starts with
    photoBtn: '#PhotoModal-Toolbar-upload-button',
    imageSelectedCheckbox: '[aria-label="item-selected"]',
    photoModalSubmit: '#PhotoModal-submit',
    spinner: '.teamhub-parcel-MuiCircularProgress-indeterminate',
    cropper: '.cropper-container',
    confirmImageCrop: 'button[ng-click="$ctrl.done()"]',
    // Wildcard selector making sure we're uploading something from our s3 images to the background...good enough imo
    backgroundSlideImage: '[data-background-image^="https://k4connect-document-staging.s3.amazonaws.com/communities/"]'
  },
	save: 'button[ng-click="$ctrl.close()"]',
};

/**
 * This abstracts the actions relating to the Properties Tool
 * @namespace PropsTool
 */
export default class PropsTool {
	/**
	 * Method to open the Props Tool panel
	 */
	static open = () => Click.on(PT.button);

	/**
	 * Method to save your props changes
	 */
	static save = () => Click.on(PT.save);

	/**
	 * Method to change the duration
	 */
	static changeDurationTo = (seconds) =>
		Type.theText(seconds).into(PT.durationInput);

	/**
	 * Method to change the background color
	 */
	static changeBackgroundColor = () => {
    Click.onFirst(PT.colorPicker.btn);
    Click.on(PT.colorPicker.hotPink);
    Click.on(PT.save);
    Verify.theElement(PT.colorPicker.btn).isntVisible()
  };
  

	/**
	 * Method to change the background image
	 */
	static changeBackgroundImage = () => {
    Click.on(PT.backgroundImage.btn);
    Verify.theElement(PT.backgroundImage.spinner).isVisible()
    Upload.theFile('testphoto.png').into(PT.backgroundImage.photoBtn)
    Click.on(PT.backgroundImage.uploadedPhoto)
    Verify.theElement(PT.backgroundImage.imageSelectedCheckbox).isVisible()
    Click.on(PT.backgroundImage.photoModalSubmit)
    Verify.theElement(PT.backgroundImage.cropper).isVisible()
    Click.on(PT.backgroundImage.confirmImageCrop)
	};
}
