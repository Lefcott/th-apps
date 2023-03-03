'use strict';

import template from './remove.component.html';
import './remove.component.css';

export default class RemoveElementComponent {

	static get $inject() {
    return ['contentEditorService'];
	}

	constructor(contentEditorService) {
		this.contentEditorService = contentEditorService;
	}

	$onInit() {
		$('#content-creator').keyup((e) => {
      if ((e.keyCode == 46 || e.keyCode == 8) && this.contentEditorService.currentSelected && !this.contentEditorService.editingText) {
        this.removeElement(this.currentSelected);
      }
    });
	}

	removeElement(element) {
		if (!element) {
			element = this.contentEditorService.currentSelected;
		}
		this.contentEditorService.clearCurrent();
		$(element).remove();

		this.contentEditorService.saveState();
	}

}

export var RemoveElementComponentConfig = {
	template: template,
	controller: RemoveElementComponent
}