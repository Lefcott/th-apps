"use strict";

export default class CanvasService {
  static get $inject() {
    return ["contentEditorService", "masterService", "displayService"];
  }

  constructor(contentEditorService, masterService, displayService) {
    this.contentEditorService = contentEditorService;
    this.masterService = masterService;
    this.displayService = displayService;

    this.masterObj = this.masterService.getUrlParams();

    this.defaultCanvas = { width: 1920, height: 1080 };
    this.defaultOrientation = "digital-landscape";

    let orientation = this.masterObj.orientation || this.defaultOrientation;

    this.orientation = orientation.toLowerCase();
  }

  loadCanvas() {
    this.settings = this.contentEditorService.settings || {};
    this.canvasOrientations = this.settings.orientations || {};

    let portalWidth = $(".portal__container").width();
    let portalHeight = $(".portal__container").height();

    let canvasLayout =
      this.canvasOrientations[this.orientation] || this.defaultCanvas;

    let width = canvasLayout.width;
    let height = canvasLayout.height;
    let orientation = this.orientation;
    let canvasPadding = 0.8; //padding around canvas area in the portal (20%)
    let minScale;

    //if 'portrait' canvas
    if (Math.floor(width / height) === 0) {
      this.contentEditorService.handleSize = 20;
      minScale = (portalHeight * canvasPadding) / height;
    } else {
      this.contentEditorService.handleSize = 30;
      minScale = (portalWidth * canvasPadding) / width;
    }

    this.contentEditorService.originalZoomScale = minScale;

    let canvasConfig = {
      width: width,
      height: height,
      transition: "none",
      minScale: minScale,
      maxScale: minScale,
      center: true,
      dependencies: [],
      progress: false,
      keyboard: false,
      overview: false,
      controls: false,
      dom: {
        // Cache references to key DOM elements
        wrapper: document.querySelector(".reveal"),
        slides: document.querySelector(".reveal .slides"),
      },
    };

    window.Reveal = Reveal;
    Reveal.configure(canvasConfig);

    this.contentEditorService.createGrid();
    this.contentEditorService.setup();

    //currently only poster size
    // https://k4connect.atlassian.net/browse/K4COMM-1493
    if(width > 7000) {
      this.contentEditorService.gridEnabled = false
    } else {
      this.contentEditorService.gridEnabled = true
      this.contentEditorService.redraw();
    }

    $(".slides").addClass(orientation);
    $(".slides").attr("scale", minScale);

    Reveal.addEventListener("slidechanged", (event) => {
      this.contentEditorService.currentSlide = $("section.present");
      this.contentEditorService.checkPermissions();
    });

    $(".backgrounds").css("height", minScale * height);
    $(".backgrounds").css("width", minScale * width);
    $(".backgrounds").css("left", "50%");
    $(".backgrounds").css("top", "50%");
    $(".backgrounds").css("transform", "translate(-50%,-50%)");
  }

  isPortrait() {
    return this.orientation.indexOf("portrait") > -1;
  }
}
