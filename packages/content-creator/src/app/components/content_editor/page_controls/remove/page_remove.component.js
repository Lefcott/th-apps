"use strict";

import template from "./page_remove.html";
import "./page_remove.css";

export class PageRemoveComponent {
  static get $inject() {
    return [
      "$uibModal",
      "$scope",
      "contentEditorService",
      "masterService",
      "htmlService",
    ];
  }

  constructor(
    $uibModal,
    $scope,
    contentEditorService,
    masterService,
    htmlService
  ) {
    this.$uibModal = $uibModal;
    this.$scope = $scope;
    this.contentEditorService = contentEditorService;
    this.htmlService = htmlService;
    this.masterObj = masterService.getUrlParams();
    this.documentGuid = this.masterObj.documentId;
  }

  remove() {
    let modalInstance = this.$uibModal.open({
      animation: true,
      component: "deleteModalComponent",
      appendTo: $('#content-creator'),
    });

    modalInstance.result.then(
      async (result) => {
        let page = Reveal.getIndices().h;

        await this.htmlService.deletePage(this.documentGuid, page);

        $(this.contentEditorService.currentSlide).remove();
        Reveal.next();
        Reveal.prev();
        Reveal.navigateTo(Reveal.getIndices().h);
        this.contentEditorService.currentSlideNumber =
          Reveal.getIndices().h + 1;
        this.contentEditorService.totalSlideNumber = Reveal.getTotalSlides();
        if (Reveal.getTotalSlides() == 1) {
          this.contentEditorService.slideRemove = false;
        }
        this.$scope.$applyAsync();
        this.contentEditorService.clearCurrent();
        Reveal.sync();

        this.contentEditorService.currentSlide = $("section.present");
        return;
      },
      (dismiss) => {}
    );
  }
}

export var PageRemoveComponentConfig = {
  template: template,
  controller: PageRemoveComponent,
};
