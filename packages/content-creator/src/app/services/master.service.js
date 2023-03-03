"use strict";
import queryString from "query-string";

export default class MasterService {
  static get $inject() {
    return ["$window"];
  }

  constructor($window) {
    this.$window = $window;
    this.masterObj;
  }

  getUrlParams() {
    let searchParams = queryString.parse(this.$window.location.search, {
      parseBooleans: true,
    });
    return searchParams;
  }
}
