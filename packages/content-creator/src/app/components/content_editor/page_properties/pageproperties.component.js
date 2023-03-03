"use strict";

import "./pageproperties.css";
import template from "./pageproperties.html";

export class PagePropertiesComponent {
  static get $inject() {
    return [
      "$scope",
      "$uibModal",
      "contentEditorService",
      "extBridgeService",
      "$rootScope",
      "singleSpaService",
    ];
  }

  constructor(
    $scope,
    $uibModal,
    contentEditorService,
    extBridgeService,
    $rootScope,
    singleSpaService
  ) {
    this.$scope = $scope;
    this.$uibModal = $uibModal;
    this.contentEditorService = contentEditorService;
    this.extBridgeService = extBridgeService;
    this.modalInstance = null;
    this.backgroundConfigModal = null;
    this.$rootScope = $rootScope;
    this.singleSpaService = singleSpaService;
  }

  $onInit() {
    this.openModal();
    this.getDimensions();
  }

  openModal() {
    this.backgroundConfigModal = this.$uibModal.open({
      template: template,
      appendTo: $('#content-creator'),
      scope: this.$scope,
      size: "sm",
      backdrop: "static",
    });
    this.backgroundConfigModal.result.then(
      (result) => {},
      (dismiss) => {}
    );
  }

  //these need to be handled differently, as background images
  addBackgroundImage() {
    const self = this;
    this.backgroundConfigModal.dismiss();
    this.singleSpaService.mount(this.singleSpaService.Parcel.PhotoModal, {
      onSubmit(photos) {
        const [photo] = photos;
        self.modalInstance = self.$uibModal.open({
          size: "md",
          animation: true,
          component: "imageUpload",
          resolve: {
            record: () => ({
              data: photo,
            }),
            bgImage: true,
          },
        });

        self.modalInstance.result.then(
          (result) => {
            if (result == "close") {
              return;
            }
          },
          (dismiss) => {}
        );
      },
    });
  }

  close() {
    this.backgroundConfigModal.dismiss();
  }

  getDimensions() {
    let orientation = this.contentEditorService.urlParams.orientation.toLowerCase();

    switch (orientation) {
      case "digital-landscape":
        this.dimensions = "1920 x 1080";
        break;

      case "digital-portrait":
        this.dimensions = "1080 x 1920";
        break;

      case "print-landscape":
        this.dimensions = "3300 x 2550";
        break;

      case "print-portrait":
        this.dimensions = "2550 x 3300";
        break;

      default:
        this.dimensions = "1920 x 1080";
    }
  }
}

export var PagePropertiesComponentConfig = {
  controller: PagePropertiesComponent,
};
