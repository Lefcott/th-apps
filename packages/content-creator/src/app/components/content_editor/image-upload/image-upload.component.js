"use strict";

import template from "./image-upload.component.html";
import "./image-upload.component.css";
import uuid from 'uuid';

export class ImageUpload {
  static get $inject() {
    return ["$http", "contentEditorService", "urlService", "masterService"];
  }

  constructor($http, contentEditorService, urlService, masterService) {
    this.$http = $http;
    this.contentEditorService = contentEditorService;
    this.urlService = urlService;
    this.masterService = masterService;
    this.canvas;
    this.elementWidth;
    this.elementHeight;
    this.masterObj = this.masterService.getUrlParams();
  }

  $onInit() {
    if (this.contentEditorService.currentSelected == null) {
      this.contentEditorService.currentSelected = this.contentEditorService.currentSlide;
    }

    if (!this.resolve.record) {
      return this.cancel();
    }

    let uploadData = this.resolve.record.data;
    let url = uploadData.url;
    this.currentUploadGuid = uploadData.guid;

    //handle document photo uploads vs community photos
    if (uploadData && uploadData.contentId) {
      try {
        url = JSON.parse(url);
        url = url[0];
      } catch (e) {
        return console.warn("invalid url");
      }
    } else {
      url = uploadData.url;
    }

    this.$http({
      method: "GET",
      responseType: 'blob',
      url: url.replace('v3', 'v2'),
    }).then((data) => {
      this.canvas = $("#image-canvas");

      this.elementWidth = $(this.contentEditorService.currentSelected)
        .css("width")
        .replace("px", "");
      this.elementHeight = $(this.contentEditorService.currentSelected)
        .css("height")
        .replace("px", "");
      let context = this.canvas.get(0).getContext("2d");

      let reader = new FileReader();
      reader.onload = (evt) => {
        let img = new Image();
        img.onload = () => {
          context.canvas.height = img.height;
          context.canvas.width = img.width;
          context.drawImage(img, 0, 0);
          this.canvas.cropper({
            aspectRatio: this.elementWidth / this.elementHeight,
            dragMode: "move",
            zoomable: true,
            zoomOnWheel: false,
            cropBoxResizable: false,
          });
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(data.data);
    });
  }

  rotateClock() {
    this.canvas.cropper("rotate", 45);
  }

  rotateCounterClock() {
    this.canvas.cropper("rotate", -45);
  }

  zoomIn() {
    this.canvas.cropper("zoom", 0.1);
  }

  zoomOut() {
    this.canvas.cropper("zoom", -0.1);
  }

  async getUploadUrl(formData) {
    const{ data } = await this.$http({
      method: "POST",
      url: `${this.urlService.getDocument()}/upload/getSignedUrl`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        communityId: this.masterObj.communityId,
        filename: `${formData.croppedImage.name}_${uuid.v4()}.${formData.croppedImage.type.split('/')[1]}`,
        contentType: formData.croppedImage.type 
      },
    });

    return data;
  }

  done() {
    let imageComponent = $(this.contentEditorService.currentSelected);

    this.canvas.cropper("getCroppedCanvas").toBlob(async (blob) => {
      let formData = new FormData();
      formData.append("croppedImage", blob);
      let formValues = {}
      for (var p of formData) {
        let name = p[0];
        let value = p[1];
        formValues[name] = value;
      }

      const urls = await this.getUploadUrl(formValues);

      this.$http({
        method: "PUT",
        url: urls.uploadUrl, 
        headers: {
          "Content-Type": formValues.croppedImage.type,
        },
        data: blob,
      })
        .then((response) => {
          if (this.resolve.bgImage) {
            this.contentEditorService.currentSlide.removeAttr(
              "data-background-color"
            );
            this.contentEditorService.currentSlide.attr(
              "data-background-image",
              `${urls.targetUrl}`
            );
            this.contentEditorService.currentSlide.attr(
              "data-background-size",
              "contain"
            );
            this.contentEditorService.saveState();
            Reveal.sync();
          } else {
            //this feels wonky - but lets us resize and re-select
            let imgDOM = $("<div>");
            imgDOM[0].style[
              "backgroundImage"
            ] = `url("${urls.targetUrl}")`;
            imgDOM[0].style["backgroundSize"] = "cover";
            imgDOM[0].style["height"] = "100%";
            imgDOM[0].style["width"] = "100%";

            imageComponent
              .children()
              .attr("widget-src", `'${urls.targetUrl}'`);
            imageComponent.children().children().html(imgDOM);

            $(imageComponent)
              .find(".placeholder__container")
              .css("background-color", "transparent");

            this.contentEditorService.saveState();
          }
        })
        .catch((response) => {
          console.log("Error ", response);
        });
    });

    this.close({
      $value: "close",
    });

    this.contentEditorService.clearCurrent();
  }

  cancel() {
    this.dismiss({});
  }
}

export let ImageUploadComponentConfig = {
  template: template,
  bindings: {
    close: "&",
    dismiss: "&",
    resolve: "<",
  },
  controller: ImageUpload,
};
