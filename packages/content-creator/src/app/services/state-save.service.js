'use strict';

export default class StateSaveService {

  static get $inject() {
    return ['undoRedoService'];
  }

  constructor(undoRedoService) {
    this.undoRedoService = undoRedoService;
  }

  saveState() {
    this.undoRedoService.saveState();
  }

}
