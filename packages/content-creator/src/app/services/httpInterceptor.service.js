"use strict";

export default class HttpInterceptorService {
  static get $inject() {
    return ["$log", "urlService", "extBridgeService"];
  }

  constructor($log, urlService, extBridgeService) {
    this.$log = $log;
    this.urlService = urlService;
    this.extBridgeService = extBridgeService;
    this.extOptions = {
      infoMessage: "Your session has expired! Please login to continue."
    };

    return {
      request: this.request.bind(this),
      requestError: this.requestError.bind(this),
      response: this.response.bind(this),
      responseError: this.responseError.bind(this)
    };
  }

  request(config) {
    // do something on success
    return config;
  }

  // optional method
  requestError(rejection) {
    // do something on error
  }

  response(config) {
    // do something on success
    return config;
  }

  // optional method
  responseError(rejection, $log) {
    //unauth
    if (rejection.status == 403 || rejection.statusText == "unauthorized") {
      //if we find ext bridge, call login, esle redirect
      if (this.extBridgeService.extBridgeActive()) {
        this.extBridgeService.openExtWindow("loginPopup", this, function() {});
      } else {
        window.location.href = this.urlService.getDashboard();
      }
    }
  }
}
