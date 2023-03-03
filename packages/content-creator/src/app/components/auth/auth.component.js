"use strict";

import template from "./auth.view.html";

export class AuthComponent {
  static get $inject() {
    return ["$scope", "$log", "$uibModal", "authService"];
  }

  constructor($scope, $log, $uibModal, authService) {
    this.$scope = $scope;
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.inIframe = this.inIframe();
    let self = this;

    authService.checkCredentials().then(authorized => {
      if (!authorized) {
        this.presentUnauthPopup();
      }
      let cachedCredentials = localStorage.getItem("cachedCredentials");
      cachedCredentials = JSON.parse(cachedCredentials);
      if (
        !cachedCredentials.communityId ||
        !cachedCredentials.communityName ||
        !cachedCredentials.documentId ||
        !cachedCredentials.guid
      ) {
        this.presentUnauthPopup();
      }
    });
  }

  presentUnauthPopup() {
    let self = this;
    let modalInstance = this.$uibModal.open({
      template: template,
      appendTo: $('#content-creator'),
      size: "lg",
      backdrop: self.inIframe ? "static" : true,
      keyboard: self.inIframe ? false : true
    });

    modalInstance.result.then(
      result => {},
      dismiss => {
        if (!self.inIframe) {
          location.href = "https://dashboard.k4connect.com";
        }
      }
    );
  }

  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}

export var AuthComponentConfig = {
  controller: AuthComponent
};
