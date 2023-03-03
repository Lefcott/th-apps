"use strict";

export default class UndoRedoService {
  static get $inject() {
    return ["contentEditorService", "htmlService"];
  }

  constructor(contentEditorService, htmlService) {
    this.contentEditorService = contentEditorService;
    this.htmlService = htmlService;

    $(document).on("keydown", (event) => {
      if (
        event.keyCode == 90 &&
        event.shiftKey &&
        (event.ctrlKey || event.metaKey)
      ) {
        this.redo();
      } else if (event.keyCode == 90 && (event.ctrlKey || event.metaKey)) {
        this.undo();
      }
    });
  }

  undo() {
    let pageState = this.contentEditorService.stackMap[
      this.contentEditorService.currentSlideNumber - 1
    ];
    if (pageState.stack.length == 0 || pageState.current == 0) {
      return;
    }
    pageState.current -= 1;

    if (pageState.current === 0) {
      setTimeout(() => {
        this.contentEditorService.dirty = false;
      });
    }

    let state = pageState.stack[pageState.current];
    this.htmlService.renderTemplate($(state));
  }

  redo() {
    let pageState = this.contentEditorService.stackMap[
      this.contentEditorService.currentSlideNumber - 1
    ];
    if (pageState.current >= pageState.stack.length - 1) {
      return;
    }
    pageState.current += 1;
    let state = pageState.stack[pageState.current];
    this.htmlService.renderTemplate($(state));
  }
}
