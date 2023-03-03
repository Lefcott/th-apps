"use strict";

import template from "./switch.html";
import "./switch.css";

export class SwitchModalComponent {
  static get $inject() {
    return ["$scope", "actionMenuService", "stateSaveService"];
  }

  constructor($scope, actionMenuService, stateSaveService) {
    this.$scope = $scope;
    this.actionMenuService = actionMenuService;
    this.stateSaveService = stateSaveService;
  }

  // This modal is called from Action Menu Comp js - in MainSwitchboard function

  handleDismiss() {
    this.stateSaveService.savedState.layoutChanged = true;
    this.actionMenuService.closeDrawer();
    this.dismiss({ $value: "dismiss" });
  }

  handleClose() {
    this.close({ $value: "close" });
  }
}

export var SwitchModalComponentConfig = {
  template: template,
  bindings: {
    close: "&",
    dismiss: "&",
  },
  controller: SwitchModalComponent,
};
