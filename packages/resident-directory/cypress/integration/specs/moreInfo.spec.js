/** @format */

/// <reference types="Cypress" />

import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import {
  ResidentListItem,
  MoreInfoPanel,
  RLI,
  Searchbar,
  FormEdit,
  T,
} from '../components';
import { UrlOptions } from '../utils/SetupBrowser';
const residentName = 'NewName Lastname';
context('Tests around more info', function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Verify.theElement(RLI.loader).isVisible();
    Verify.theElement(RLI.loader).doesntExist();
    Verify.theElement(RLI.listItem).isVisible();
    Searchbar.searchFor(residentName);
    ResidentListItem.selectTheOneNamed(residentName).first();
    MoreInfoPanel.open();
    FormEdit.edit();
  });

  it('Edit resident - More Information Panel - Change Residence Type - C24597', () => {
    cy.get('input[name="residenceType"]').then(($t) => {
      let newType;
      let resType = $t.attr('Value');
      if (resType === 'Studio') {
        newType = 'Condo';
      } else {
        newType = 'Studio';
      }

      MoreInfoPanel.changeResidenceTypeTo(newType);
      FormEdit.save();
      Verify.theElement(T.toast).contains(
        'Changes were successfully made for ' + residentName + '.',
      );
    });
  });

  it('Edit resident - More Information Panel - Change Residence Type - C24598', () => {
    MoreInfoPanel.changeMoveInDate();
  });
});
