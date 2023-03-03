"use strict";

export default class SettingsService {
  static get $inject() {
    return ["$http", "masterService", "urlService", "contentEditorService"];
  }

  constructor($http, masterService, urlService, contentEditorService) {
    this.$http = $http;
    this.masterService = masterService;
    this.urlService = urlService;
    this.contentEditorService = contentEditorService;

    this.masterObj = this.masterService.getUrlParams();
  }

  async getSettings() {
    let settings = await this.$http({
      method: "GET",
      url: `${this.urlService.getDocument()}/settings/${
        this.masterObj.communityId
      }?raw=false`,
    });

    this.contentEditorService.settings = settings.data;
  }
}
