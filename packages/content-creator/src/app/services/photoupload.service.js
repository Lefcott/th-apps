"use strict";

export default class PhotoUploadService {
  static get $inject() {
    return [
      "$log",
      "$http",
      "urlService",
      "masterService",
      "stateSaveService",
      "$q"
    ];
  }

  constructor($log, $http, urlService, masterService, stateSaveService, $q) {
    this.$log = $log;
    this.$http = $http;
    this.urlService = urlService;
    this.masterService = masterService;
    this.stateSaveService = stateSaveService;
    this.$q = $q;
    this.cancelUpload = this.$q.defer();
    this.masterObj = this.masterService.getUrlParams();
    this.communityName = this.masterObj.communityName;
    this.communityId = this.masterObj.communityId;
    this.fileName = "";
    this.image = {
      size: []
    };
    ContentTools.IMAGE_UPLOADER = this.imageUploader.bind(this);
  }

  imageUploader(dialog) {
    let image, xhr, xhrComplete, xhrProgress;
    let self = this;

    function rotateImage(direction) {
      return self
        .$http({
          method: "POST",
          url: `${self.urlService.getDocument()}/editPhoto`,
          headers: {
            "Content-Type": undefined
          },
          data: {
            communityName: self.communityName,
            communityId: self.communityId,
            fileName: self.fileName,
            operation: "rotate",
            options: [direction]
          }
        })
        .then(response => {
          self.$log.info("success");
          response.data.url[0] = response.data.url[0] + "?date=" + Date.now();
          dialog.busy(false);
          let newImage = {
            url: response.data.url[0],
            size: self.image.size
          };
          dialog.populate(newImage.url, newImage.size, null);
        })
        .catch(response => {
          new ContentTools.FlashUI("no");
          self.$log.error("Error in upload: ", response);
          dialog.clear();
          dialog.busy(false);
        });
    }

    dialog.addEventListener("imageuploader.clear", () => {
      dialog.clear();
      image = null;
    });
    dialog.addEventListener("imageuploader.cancelupload", () => {
      this.cancelUpload.resolve();
      dialog.state("empty");
    });

    dialog.addEventListener("imageuploader.fileready", ev => {
      let file = ev.detail().file;
      let fd;

      image = {};

      dialog.state("uploading");
      dialog.progress(0);

      fd = new FormData();
      fd.append("file", file);

      return this.$http({
        method: "POST",
        url: `${this.urlService.getDocument()}/uploadPhoto?communityName=${this.communityName}&communityId=${this.communityId}`,
        transformRequest: angular.identity,
        headers: {
          "Content-Type": undefined
        },
        timeout: this.cancelUpload.promise,
        uploadEventHandlers: {
          progress: function(event) {
            if (event.lengthComputable) {
              dialog.progress(event.loaded / event.total * 100);
            }
          }
        },
        data: fd
      })
        .then(response => {
          image.url = response.data.files[0].url;
          if (response.data.message) {
            image.message = response.data.message.replace(".", ".<br>");
          } else {
            image.message = null;
          }
          this.fileName = response.data.files[0].filename;
          this.image.size = [
            response.data.files[0].metadata.width,
            response.data.files[0].metadata.height
          ];
          dialog.populate(image.url, this.image.size, image.message);
        })
        .catch(response => {
          dialog.busy(true);
          this.$log.error("File upload error/cancelled");
          new ContentTools.FlashUI("no");
          dialog.clear();
          // reset promise for cancel
          this.cancelUpload = this.$q.defer();
          dialog.busy(false);
        });
    });

    dialog.addEventListener("imageuploader.rotateccw", () => {
      //swap size markers
      let a = self.image.size[0];
      self.image.size[0] = self.image.size[1];
      self.image.size[1] = a;
      rotateImage(270);
    });

    dialog.addEventListener("imageuploader.rotatecw", () => {
      //swap size markers
      let a = self.image.size[0];
      self.image.size[0] = self.image.size[1];
      self.image.size[1] = a;
      rotateImage(90);
    });

    // Triggered when the user selects to INSERT the image.
    dialog.addEventListener("imageuploader.save", () => {
      let crop,
        cropRegion,
        formData,
        operation,
        cropOptions,
        extractLeftArg,
        extractTopArg,
        extractOptions;
      dialog.busy(true);
      let options = this.image.size;
      let image = {
        size: options
      };
      let roundedArr = [];
      let maxSizeUpdated = [];

      if (dialog.cropRegion()) {
        cropOptions = dialog.cropRegion();

        let cropArray = {
          top: cropOptions[0],
          left: cropOptions[1],
          bottom: cropOptions[2],
          right: cropOptions[3]
        };

        for (var prop in cropArray) {
          roundedArr.push(cropArray[prop].toFixed(2) * 100);
        }

        roundedArr[2] = 100 - roundedArr[2];
        roundedArr[3] = 100 - roundedArr[3];
        let extractLeft = image.size[0] * (roundedArr[1] / 100); // width
        let extractTop = image.size[1] * (roundedArr[0] / 100); // height
        let extractLeftArg = Math.round(extractLeft);
        let extractTopArg = Math.round(extractTop);
        let amountToRemove = [
          roundedArr[1] + roundedArr[3],
          roundedArr[0] + roundedArr[2]
        ]; //  [ left/right, top/bottom ]

        let newImageSizeWidth =
          image.size[0] - image.size[0] * (amountToRemove[0] / 100);
        let newImageSizeHeight =
          image.size[1] - image.size[1] * (amountToRemove[1] / 100);

        options = [
          Math.round(newImageSizeWidth),
          Math.round(newImageSizeHeight)
        ];

        extractOptions = {
          left: extractLeftArg,
          top: extractTopArg,
          width: options[0],
          height: options[1]
        };

        // TODO: testing: adding extra w/h for max. tbd
        options.forEach(item => {
          maxSizeUpdated.push(item + 500);
        });
      }

      return this.$http({
        method: "POST",
        url: `${this.urlService.getDocument()}/editPhoto`,
        headers: {
          "Content-Type": undefined
        },
        data: {
          communityName: this.communityName,
          communityId: this.communityId,
          fileName: this.fileName,
          operation: "extract",
          options: [extractOptions]
        }
      })
        .then(response => {
          // trigger stateSaveService contentEdited
          this.stateSaveService.contentEdited = true;
          dialog.busy(true);
          dialog.busy(false);
          dialog.save(response.data.url + "?date=" + Date.now(), options, {
            alt: `${this.fileName} image`,
            "data-ce-max-width": maxSizeUpdated
          });
        })
        .catch(response => {
          this.$log.error("imageuploader.save failed ");
          new ContentTools.FlashUI("no");
          dialog.clear();
          dialog.busy(false);
          dialog.removeCropMarks();
        });
    });
  }
}
