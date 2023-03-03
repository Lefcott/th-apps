import { Click, Type } from '../interactions';
import { FP } from './';

/**
 * Link Family Modal component namespace
 *
 */
export const LFM = {
  modal: '#Rm_linkFamilyModal',
  resident: {
    dropdown: '#Rm_linkModal-dropdown',
    arrow: '.MuiAutocomplete-endAdornment',
    named: residentNamed => `li[data-value="${residentNamed}"]`
  },
  submitBtn: '#Rm_linkModal-submit',
  cancelBtn: '#Rm_linkModal-cancel'
};

/**
 * This abstracts the actions relating to the Link family modal
 * @namespace LinkFamilyModal
 */
export default class LinkFamilyModal {
  /**
   * Method to link a friend or family member
   */
  static link = name => {
    Click.on(FP.familyLinkBtn);
    // Click.on(FLM.add)
    Type.theText(name).into(LFM.resident.dropdown);
    Click.on(LFM.resident.named(name));
    Click.on(LFM.submitBtn);
  };
}
