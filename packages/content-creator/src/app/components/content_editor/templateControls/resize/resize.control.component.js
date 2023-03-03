'use strict';

import template from './resize.control.component.html';
import './resize.control.component.css';

export class ResizeControlComponent {

	static get $inject() {
    return ['$scope', 'contentEditorService'];
  }

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on('elementSelected', (event, element) => {
			this.loadControlsForElement(element);
		});

		this.lockSizeAttr = 'data-lock-size';
	}

	$onInit() {
		this.lockSize = $(this.contentEditorService.currentSlide).attr(this.lockSizeAttr) == 'true';
	}

	loadControlsForElement() {
		this.lockSize = $(this.contentEditorService.currentSelected).attr(this.lockSizeAttr) == 'true';
		this.$scope.$applyAsync();
	}

	lockUnlock() {
		this.lockSize = !this.lockSize;
		if (this.contentEditorService.currentSelected) {
			$(this.contentEditorService.currentSelected).attr(this.lockSizeAttr, this.lockSize);
		} else {
			$(this.contentEditorService.currentSlide).attr(this.lockSizeAttr, this.lockSize);
		}
	}

}

export var ResizeControlComponentConfig = {
	template: template,
	controller: ResizeControlComponent
}