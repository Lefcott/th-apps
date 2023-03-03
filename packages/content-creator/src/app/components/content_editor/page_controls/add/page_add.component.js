"use strict";

import template from "./page_add.html";
import "./page_add.css";

export class PageAddComponent {
	static get $inject() {
		return ["contentEditorService", "headerPropertiesService"];
	}

	constructor(contentEditorService, headerPropertiesService) {
		this.slidesContainer = document.querySelector(".slides");
		this.contentEditorService = contentEditorService;
		this.headerPropertiesService = headerPropertiesService;
	}

	add() {
		var newSlide = document.createElement("section");
		let currentSection = this.slidesContainer.querySelector("section.present");
		newSlide.classList.add("future");
		currentSection.insertAdjacentElement("afterend", newSlide);
		$(newSlide).attr("data-background-color", "#fff");
		$(".navigate-right").addClass("enabled");
		Reveal.sync();
		Reveal.navigateTo(Reveal.getIndices().h + 1);
		this.contentEditorService.slideRemove = true;
		this.contentEditorService.clearCurrent();
		this.contentEditorService.currentSlideNumber = Reveal.getIndices().h + 1;
		this.contentEditorService.totalSlideNumber = Reveal.getTotalSlides();
		this.headerPropertiesService.changeSlide(
			this.contentEditorService.currentSlideNumber,
		);
		this.contentEditorService.initPageState(true);
		this.contentEditorService.saveState();
	}
}

export var PageAddComponentConfig = {
	template: template,
	controller: PageAddComponent,
};
