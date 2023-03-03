"use strict";

export default class AuthService {
  static get $inject() {
    return ["$http", "$log", "CachedCredentials"];
  }

  constructor($http, $log, CachedCredentials) {
    this.$http = $http;
    this.$log = $log;
    this.cachedCredentials = new CachedCredentials().getCredentials();
  }

  checkCredentials() {
    return new Promise((resolve, reject) => {
      if (
        !this.cachedCredentials.guid ||
        !this.cachedCredentials.communityName ||
        !this.cachedCredentials.communityId
      ) {
        return resolve(false);
      }
      return resolve(true);
    });
  }
}
