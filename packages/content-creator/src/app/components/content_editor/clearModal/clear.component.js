"use strict";

import template from "./clear.html";
import "./clear.css";

export class ClearModalComponent {
  static get $inject() {
    return ["$scope", "$log", "$state", "$stateParams", "htmlService"];
  }

  constructor($scope, $log, $state, $stateParams, htmlService) {
    this.$scope = $scope;
    this.$log = $log;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.htmlService = htmlService;
  }

  handleClear() {
    let currentState = this.$state.current.name;
    this.htmlService.project = [];
    this.$state.go(currentState, this.$stateParams, {
      reload: true,
      inherit: false,
      notify: true
    });
    this.dismiss({ $value: "dismiss" });
  }

  handleClose() {
    this.close({ $value: "close" });
  }
}

export var ClearModalComponentConfig = {
  template: template,
  bindings: {
    close: "&",
    dismiss: "&"
  },
  controller: ClearModalComponent
};
