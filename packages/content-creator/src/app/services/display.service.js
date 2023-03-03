"use strict";

export default class DisplayService {
  static get $inject() {
    return ["$rootScope"];
  }

  constructor($rootScope) {
    this.$rootScope = $rootScope;
    this.switchModalTemplateTracker = "";
    this.maxZoom = 800;
    this.zoomControls = [...(Array(this.maxZoom + 1).keys())].filter((n)=> n%10 == 0);
    this.default = 10;
    this.currentZoom = this.zoomControls[this.default];
    this.hidePageControls = false;
  }

  zoom(arg) {
  
      let zoomItem = angular.element(document.querySelector("#zoom-item"));
      this.$rootScope.$broadcast(arg, zoomItem);
      if (arg == "zoomIn") {
        this.currentZoom = this.zoomControls[(this.default += 1)];
      }
      if (arg == "zoomReset") {
        this.currentZoom = this.zoomControls[(this.default = 10)];
      }
      if (arg == "zoomOut") {
        this.currentZoom = this.zoomControls[(this.default -= 1)];
      }
  }
}
