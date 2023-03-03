import template from "./page_order.html";
import "./page_order.css";

export class PageOrderComponent {
  static get $inject() {
    return ["$scope", "contentEditorService"];
  }

  constructor($scope, contentEditorService) {
    this.$scope = $scope;
    this.contentEditorService = contentEditorService;
    this.pageMover = null;
    this.contentEditorService = contentEditorService;
  }

  disableReorder() {
    if (Reveal.getTotalSlides() <= 1) {
      return true;
    } else {
      return false;
    }
  }

  async saveReorder(moveTo) {
    if (
      moveTo > Reveal.getTotalSlides() ||
      moveTo <= 0 ||
      moveTo == this.contentEditorService.currentSlideNumber
    ) {
      this.contentEditorService.pageMover = null;
      return;
    }

    let reorderedProject = Reveal.getSlides();
    let currentProject = Reveal.getSlides();

    if (moveTo > this.contentEditorService.currentSlideNumber) {
      reorderedProject.splice(moveTo, 0, Reveal.getCurrentSlide());
      reorderedProject.splice(
        this.contentEditorService.currentSlideNumber - 1,
        1
      );
    } else {
      reorderedProject.splice(moveTo - 1, 0, Reveal.getCurrentSlide());
      reorderedProject.splice(this.contentEditorService.currentSlideNumber, 1);
    }

    while (currentProject.firstChild) {
      currentProject.removeChild(currentProject.firstChild);
    }

    reorderedProject.forEach((slide) => $(".slides").append(slide));

    Reveal.sync();
    Reveal.navigateTo(moveTo - 1);
    this.contentEditorService.currentSlideNumber = Reveal.getIndices().h + 1;
    this.pageMover = null;
    this.contentEditorService.reorderPopup = false;

    $(reorderedProject[moveTo - 1]).addClass("present");
    this.contentEditorService.saveState();
  }

  openPopup() {
    this.contentEditorService.reorderPopup = !this.contentEditorService
      .reorderPopup;
  }
}

export var PageOrderComponentConfig = {
  template: template,
  controller: PageOrderComponent,
};
