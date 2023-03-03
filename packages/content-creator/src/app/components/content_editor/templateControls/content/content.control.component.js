'use strict';

import template from './content.control.component.html';
import './content.control.component.css';

export class ContentControlComponent {

	static get $inject() {
    return ['$scope', 'contentEditorService'];
  }

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on('elementSelected', (event, element) => {
			this.loadControlsForElement(element);
		});

		this.lockContentAttr = 'data-lock-content';
	}

	$onInit() {
		this.lockContent = $(this.contentEditorService.currentSlide).attr(this.lockContentAttr) == 'true';
	}

	loadControlsForElement() {
		this.lockContent = $(this.contentEditorService.currentSelected).attr(this.lockContentAttr) == 'true';
		this.$scope.$applyAsync();
	}

	lockUnlock() {
		this.lockContent = !this.lockContent;
		if (this.contentEditorService.currentSelected) {
			$(this.contentEditorService.currentSelected).attr(this.lockContentAttr, this.lockContent);
		} else {
			$(this.contentEditorService.currentSlide).attr(this.lockContentAttr, this.lockContent);
		}
	}

}

export var ContentControlComponentConfig = {
	template: template,
	controller: ContentControlComponent
}