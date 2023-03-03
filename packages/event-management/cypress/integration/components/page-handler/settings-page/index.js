/** @format */

import { Click, Type } from '../../../interactions';
import { Verify } from '../../../assertions';
import SettingsPageElements from '../../page-elements/settings-page/elements';

export default class SettingsPageComponent {
  static searchRow = (name) => {
    Type.theText(name).into(SettingsPageElements.searchBar);
  };

  static deleteLastRow = (name) => {
    Type.theText(name).into(SettingsPageElements.searchBar);
    Click.on(
      SettingsPageElements.lastDeleteBtn,
      'Delete Btn for last item in Row',
    );
    Click.on(
      SettingsPageElements.lastRowDeleteConfirm,
      'Delete Confirmation Btn',
    );
    Verify.theElement(
      SettingsPageElements.lastRow,
      'Last Item in Row',
    ).doesntContain(name);
  };

  static editLastRow = (name, abv) => {
    Click.on(SettingsPageElements.lastEditBtn);
    Type.theText(name).into(SettingsPageElements.nameEdit);
    if (abv) {
      Type.theText(abv).into(SettingsPageElements.abbvInput);
    }
    Click.on(SettingsPageElements.editSave);
    Type.theText(name).into(SettingsPageElements.searchBar);
    Verify.theElement(SettingsPageElements.lastRow).contains(name);
  };
  static newLocationNamed = (name) => {
    Verify.theElement(
      SettingsPageElements.header,
      'Locations Settings Page Header',
    ).contains('Locations');
    Click.on(SettingsPageElements.newBtn, 'New Location Btn');
    Type.theText(name).into(
      SettingsPageElements.nameInput,
      'Location Name Input',
    );
    return {
      abbreviated: (abv) => {
        Type.theText(abv).into(
          SettingsPageElements.abbvInput,
          'Location Abbreviation Input',
        );
        Click.on(SettingsPageElements.saveBtn, 'Save Location Btn');
        Type.theText(name).into(SettingsPageElements.searchBar);
        Verify.theElement(SettingsPageElements.lastRow).contains(name);
      },
    };
  };

  static newEventTypeNamed = (name) => {
    Verify.theElement(
      SettingsPageElements.header,
      'Event Types Settings Page Header',
    ).contains('Event Type');
    Click.on(SettingsPageElements.newBtn, 'New Event Type Btn');
    Type.theText(name).into(
      SettingsPageElements.nameInput,
      'Event Type Name Input',
    );
    Click.on(SettingsPageElements.saveBtn, 'Save Event Type Btn');
    Type.theText(name).into(SettingsPageElements.searchBar);
    Verify.theElement(SettingsPageElements.lastRow).contains(name);
  };

  static newCalendarNamed = (name) => {
    Verify.theElement(
      SettingsPageElements.header,
      'Calenders Settings Page Header',
    ).contains('Calendars');
    Click.on(SettingsPageElements.newBtn, 'New Cal Btn');
    Type.theText(name).into(SettingsPageElements.nameInput, 'Cal Name Input');
    Click.on(SettingsPageElements.saveBtn, 'New Cal Save Btn');
    Type.theText(name).into(SettingsPageElements.searchBar);
    Verify.theElement(SettingsPageElements.lastRow).contains(name);
  };
}
