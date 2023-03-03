"use strict";

import template from "./zoom.html";
import "./zoom.css";

export class ZoomComponent {
  static get $inject() {
    return ["displayService", "contentEditorService"];
  }

  constructor(displayService, contentEditorService) {
    this.displayService = displayService;
    this.contentEditorService = contentEditorService;
  }

  zoomPercentage() {
    return `${this.displayService.currentZoom}%`;
  }

  zoomBtn(arg) {
    this.contentEditorService.clearCurrent();
    this.displayService.zoom(arg);
  }

  disableZoomIn() {
    let currentZoom = this.displayService.currentZoom;
    let maxZoom = this.displayService.zoomControls.length - 1;

    if (this.displayService.zoomControls.indexOf(currentZoom) == maxZoom) {
      return true;
    }
  }

  disableZoomOut() {
    if (this.displayService.currentZoom == "50") {
      return true;
    }
  }
}

export var ZoomComponentConfig = {
  template: template,
  controller: ZoomComponent,
};
