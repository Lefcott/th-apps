"use strict";
import { navigationGuard } from "@teamhub/navbar";
import {
  PreviewParcelConfig,
  NavigateAwayModal,
  InsertionModal,
  PhotoModal,
} from "@teamhub/parcels";

const Parcel = {
  Preview: "preview",
  NavigateAwayModal: "navigate-away-modal",
  InsertionModal: "insertion-modal",
  PhotoModal: "photo-modal",
};

const ParcelConfig = {
  [Parcel.Preview]: PreviewParcelConfig,
  [Parcel.NavigateAwayModal]: NavigateAwayModal,
  [Parcel.InsertionModal]: InsertionModal,
  [Parcel.PhotoModal]: PhotoModal,
};

export default class SingleSpaService {
  static get $inject() {
    return ["$rootScope", "contentEditorService", "htmlService"];
  }
  constructor($rootScope, contentEditorService, htmlService) {
    this.rootScope = $rootScope;
    this.contentEditorService = contentEditorService;
    this.htmlService = htmlService;
    this.parcels = {};
    this.Parcel = Parcel;
    this.ParcelConfig = ParcelConfig;
  }

  async mount(name, parcelData = {}) {
    this.rootScope.singleSpaProps.mountParcel(this.ParcelConfig[name], {
      domElement: this.getMountElement(),
      parcelData,
    });
  }

  getMountElement() {
    return document.getElementById("single-spa-container");
  }

  containerInit() {
    // re-init to put container as the first child of the body
    $("#single-spa-container").remove();
    const div = $("<div>");
    div.attr("id", "single-spa-container");
    setTimeout(() => {
      $("body").prepend(div);
    }, 0)
  }

  checkDirtyStateBeforeLeave() {
    const self = this;
    navigationGuard.beforeLeave(() => {
      return new Promise((resolve) => {
        if (!self.contentEditorService.dirty) {
          return resolve();
        }

        self.mount(self.Parcel.NavigateAwayModal, {
          async onSaveAndExit() {
            await self.htmlService.saveToServer("save");
            setTimeout(resolve);
          },

          onExit() {
            setTimeout(resolve);
          },

          onCancel() {
            setTimeout(() => resolve(false));
          },
        });
      });
    });
  }
}
