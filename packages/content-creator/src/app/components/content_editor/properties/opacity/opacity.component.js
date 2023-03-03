/** @format */

"use strict";

import template from "./opacity.component.html";
import "./opacity.component.css";

export class OpacityComponent {
	static get $inject() {
		return ["$scope", "contentEditorService"];
	}

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on("elementSelected", (event, element) => {
			this.loadOpacity(element);
		});
	}

	getElement(element) {
		if ($(element).hasClass("text-box")) {
			//Apply to div with id of text-editor
			return element.children[0].children[0];
		} else {
			return $(element).find(":first-child");
		}
	}

	loadOpacity(element) {
		let opacityText = $("#calendar-opacity-text-opacity");

		// Load opacity from selected element
		/** @format */
		let applyOpacityDiv = this.getElement(element);
		let value = $(applyOpacityDiv).css("opacity");

		// Setup opacity slider
		$("#opacity-slider").slider({
			min: 5,
			max: 100,
			value: value * 100,
			create: () => {
				opacityText.text($("#opacity-slider").slider("value"));
			},
			change: () => {
				opacityText.text($("#opacity-slider").slider("value"));
			},
			slide: (event, ui) => {
				let applyOpacityDiv = this.getElement(element);
				opacityText.text(ui.value);
				let opacity = ui.value / 100;

				$(applyOpacityDiv).css("opacity", opacity);
			},
			stop: () => {
				this.contentEditorService.saveState();
			},
		});
	}
}

export var OpacityComponentConfig = {
	template: template,
	controller: OpacityComponent,
};
