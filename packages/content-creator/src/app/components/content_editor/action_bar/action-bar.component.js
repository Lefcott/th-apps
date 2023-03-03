'use strict';

import template from './action-bar.html';
import './action-bar.css';

export class ActionBarComponent {

  static get $inject() {
    return ['$scope', 'masterService'];
  }

  constructor($scope, masterService) {
    this.$scope = $scope;
    this.masterObj = masterService.getUrlParams();
  }
}

export var ActionBarComponentConfig = {
  template: template,
  controller: ActionBarComponent
};
