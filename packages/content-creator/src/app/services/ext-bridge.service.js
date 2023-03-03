"use strict";

export default class ExtBridgeService {
  static get $inject() {
    return ["$window", "$log"];
  }

  constructor($window, $log) {
    this.$window = $window;
    this.$log = $log;
  }

  setupIframe() {
    // SCRIPT FOR COMMUNICATION WITH CONTENT EDITOR
    try {
      if (window.location.href.indexOf("community.k4connect.com") > -1) {
        document.domain =
          "community.k4connect.com.s3-website-us-east-1.amazonaws.com";
      } else if (!window.location.href.match(/localhost/gi)) {
        document.domain = "k4connect.com";
      } else {
        document.domain = "localhost";
      }
    } catch (e) {
      this.$log.warn(e);
    }
  }

  openExtWindow(windowName, context, callback, location) {
    let className = windowMap[windowName];
    if (!className) {
      return console.warn("ext classname not registered");
    }

    if(!context.extOptions) {
      context.extOptions = {};
    }
    let newExtWindow = window.parent.Ext.create(className, {});

    if (location) {
      newExtWindow.location = location;
    }

    newExtWindow.record = window.parent.contentEditorRecord;
    newExtWindow = $.extend(true, newExtWindow, context.extOptions);
    newExtWindow.show();
    newExtWindow.on("close", function() {
      var data = newExtWindow.data;
      //clean up component if not already destroyed
      if (newExtWindow) {
        newExtWindow.destroy();
      }
      callback(data, context);
    });
  }

  extBridgeActive() {
    return window.parent.Ext ? true : false;
  }
}

let windowMap = {
  beaconPopup: "widget.admin.popups.beaconpopup", //test
  importPopup: "widget.ImportPopup", //import popup
  publishPopup: "wizards.publish.publishPopup", //publish popup
  loginPopup: "widget.login.popup", //login popup
  photoPicker: "widget.PhotoPicker", //photopicker popup
  previewWindow: "widget.iframeWindow" //preview popup
};
