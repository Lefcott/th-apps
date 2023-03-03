/** @format */

export default {
  newPostBtn: '#AP_newPost',
  modal: '#AP_postmodal',
  title: '#AP_postmodal-title',
  author: {
    btn: '#AP_postmodal-showAuthorInput',
    input: '#AP_postmodal-author',
  },
  description: {
    btn: '#AP_postmodal-showDescriptionInput',
    input: '#AP_postmodal-description',
  },
  link: {
    btn: '#AP_postmodal-showLinkInput',
    input: '#AP_postmodal-url',
  },
  file: {
    btn: '#AP_postmodal-showFileUploadInput',
    input: '[data-testid="AP_postmodal-dropzonearea"]',
  },
  file: {
    btn: '#AP_postmodal-showFileUploadInput',
    input: '[data-testid="AP_postmodal-dropzonearea"]',
    uploadedFile: '[role="upload-item"]',
  },
  category: '#AP_postmodal-category',
  tags: {
    input: `#AP_postmodal-tags`,
    tag: '.MuiChip-label',
  },
  pushNotification: {
    checkbox: '#AP_postmodal-enableNotification',
    helperText: '#AP_postmodal-enableNotification-helpertext',
  },
  careSettings: {
    dropdownEle: '#AP_careSetting-filter-select',
    allCareSettings: '#AP_careSetting-filter-option-all',
    selectCareSetting: `[id^=AP_careSetting-filter-option]`,
    selectedElements: '#AP_careSetting-filter-select p',
  },
  cancelBtn: '#AP_postmodal-cancel',
  postBtn: '#AP_postmodal-post',
};
