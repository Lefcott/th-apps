'use strict';

import template from './page.duration.html';
import './page.duration.css';

export class PageDurationComponent {

  static get $inject() {
    return ['$scope', 'contentEditorService'];
  }

  constructor($scope, contentEditorService) {
    this.$scope = $scope;
    this.contentEditorService = contentEditorService;
    this.pageDurationAttr = 'data-page-duration';
  }

  $onInit() {
    this.$scope.duration = parseInt(this.contentEditorService.currentSlide.attr(this.pageDurationAttr));
  }

  changeDuration() {
    this.contentEditorService.currentSlide.attr(this.pageDurationAttr, this.$scope.duration);
  }
}

export var PageDurationComponentConfig = {
  template: template,
  controller: PageDurationComponent
};
