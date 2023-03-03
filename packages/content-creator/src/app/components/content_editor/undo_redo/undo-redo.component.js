'use strict';

import template from './undo-redo.component.html';
import './undo-redo.component.css';

export class UndoRedoComponent {

	static get $inject() {
		return ['undoRedoService'];
	}

	constructor(undoRedoService) {
		this.undoRedoService = undoRedoService;
	}

	undo() {
		this.undoRedoService.undo();
	}

	redo() {
		this.undoRedoService.redo();
	}

}

export var UndoRedoComponentConfig = {
	template: template,
	controller: UndoRedoComponent
}