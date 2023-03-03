"use strict";

import template from "./page_controls.html";
import "./page_controls.css";

export class PageControlsComponent {
	static get $inject() {
		return ["contentEditorService", "headerPropertiesService"];
	}

	constructor(contentEditorService, headerPropertiesService) {
		this.contentEditorService = contentEditorService;
		this.headerPropertiesService = headerPropertiesService;
	}

	disableDirection() {
		if (
			this.contentEditorService.reorderPopup == true ||
			Reveal.getTotalSlides() <= 1
		) {
			return true;
		} else {
			return false;
		}
	}

	next() {
		if (
			this.contentEditorService.currentSlideNumber < Reveal.getTotalSlides()
		) {
			this.contentEditorService.currentSlideNumber++;
			this.headerPropertiesService.changeSlide(
				this.contentEditorService.currentSlideNumber,
			);
		}
	}

	prev() {
		if (Reveal.isFirstSlide() == false) {
			this.contentEditorService.currentSlideNumber--;
			this.headerPropertiesService.changeSlide(
				this.contentEditorService.currentSlideNumber,
			);
		}
	}
}

export var PageControlsComponentConfig = {
	template: template,
	controller: PageControlsComponent,
};
