'use strict';

import template from './depth.component.html';
import './depth.component.css';

export class DepthComponent {

	static get $inject() {
		return ['contentEditorService'];
	}

	constructor(contentEditorService) {
		this.contentEditorService = contentEditorService;
	}

	moveTo(direction) {

		let parent = this.contentEditorService.currentSelected.parentNode;
		let prevSibling = this.contentEditorService.currentSelected.previousElementSibling;
		let nextSibling = this.contentEditorService.currentSelected.nextElementSibling;

		if(direction == 'down' && prevSibling){
			parent.insertBefore(this.contentEditorService.currentSelected, prevSibling)
		} else if (direction == 'up' && nextSibling){
			parent.insertBefore(this.contentEditorService.currentSelected, nextSibling.nextElementSibling)
		}

		this.contentEditorService.saveState();
	}

}

export var DepthComponentConfig = {
	template: template,
	controller: DepthComponent
}