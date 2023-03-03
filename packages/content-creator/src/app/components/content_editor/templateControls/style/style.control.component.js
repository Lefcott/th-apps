'use strict';

import template from './style.control.component.html';
import './style.control.component.css';

export class StyleControlComponent {

	static get $inject() {
    return ['$scope', 'contentEditorService'];
  }

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on('elementSelected', (event, element) => {
			this.loadControlsForElement(element);
		});

		this.lockStyleAttr = 'data-lock-style';
	}

	$onInit() {
		this.lockStyle = $(this.contentEditorService.currentSlide).attr(this.lockStyleAttr) == 'true';
	}

	loadControlsForElement() {
		this.lockStyle = $(this.contentEditorService.currentSelected).attr(this.lockStyleAttr) == 'true';
		this.$scope.$applyAsync();
	}

	lockUnlock() {
		this.lockStyle = !this.lockStyle;
		if (this.contentEditorService.currentSelected) {
			$(this.contentEditorService.currentSelected).attr(this.lockStyleAttr, this.lockStyle);
		} else {
			$(this.contentEditorService.currentSlide).attr(this.lockStyleAttr, this.lockStyle);
		}
	}

}

export var StyleControlComponentConfig = {
	template: template,
	controller: StyleControlComponent
}