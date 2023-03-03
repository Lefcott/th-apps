"use strict";

import "./portal.css";
import template from "./portal.html";

export class PortalComponent {
  static get $inject() {
    return ["$rootScope", "$scope", "contentEditorService", "masterService"];
  }

  constructor($rootScope, $scope, contentEditorService, masterService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.contentEditorService = contentEditorService;
    this.masterService = masterService;

    this.masterObj = this.masterService.getUrlParams();
    this.orientation = this.masterObj.orientation;

    this.defaultCanvas = { width: 1920, height: 1080 };
    this.initialized = false;
  }

  //initialize canvas, final canvas rendering happens in canvas servuce
  $onInit() {
      Reveal.initialize();
      this.$rootScope.$on('canvasInitialized', () => {
        this.initialized = true;
      })
  }
}

export var PortalComponentConfig = {
  template: template,
  controller: PortalComponent,
};
