'use strict';

import template from './drag.control.component.html';
import './drag.control.component.css';

export class DragControlComponent {

	static get $inject() {
    return ['$scope', 'contentEditorService'];
  }

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on('elementSelected', (event, element) => {
			this.loadControlsForElement(element);
		});

		this.lockDragAttr = 'data-lock-pos';
	}

	$onInit() {
		this.lockDrag = $(this.contentEditorService.currentSlide).attr(this.lockDragAttr) == 'true';
	}

	loadControlsForElement() {
		this.lockDrag = $(this.contentEditorService.currentSelected).attr(this.lockDragAttr) == 'true';
		this.$scope.$applyAsync();
	}

	lockUnlock() {
		this.lockDrag = !this.lockDrag;
		if (this.contentEditorService.currentSelected) {
			$(this.contentEditorService.currentSelected).attr(this.lockDragAttr, this.lockDrag);
		} else {
			$(this.contentEditorService.currentSlide).attr(this.lockDragAttr, this.lockDrag);
		}
	}

}

export var DragControlComponentConfig = {
	template: template,
	controller: DragControlComponent
}