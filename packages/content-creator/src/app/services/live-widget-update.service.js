"use strict";

import debounce from 'lodash/debounce';
const DEBOUNCE_TIME = 1000;


export default class LiveWidgetUpdateService {
  static get $inject() {
    return ["$http", "$log", "CachedCredentials"];
  }

  constructor($http, $log, CachedCredentials) {
    this.debounced = debounce(() =>{}, DEBOUNCE_TIME);
    this.debounce = debounce;
    this.update = this.debounced;
  }
}
