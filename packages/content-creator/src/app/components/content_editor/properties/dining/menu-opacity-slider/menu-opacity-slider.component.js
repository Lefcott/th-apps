/** @format */

"use strict";

import template from "./menu-opacity-slider.component.html";
import "./menu-opacity-slider.component.css";

export class MenuOpacitySliderComponent {
	static get $inject() {
		return ["$scope", "contentEditorService"];
	}

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on("elementSelected", (event, element) => {
			setTimeout(() => this.loadOpacity(element), 0);
		});
	}

	loadOpacity(element) {
		let opacityText = $("#menu-opacity-text-opacity");
		// Setup opacity slider
		$("#menu-opacity-slider").slider({
			min: 5,
			max: 100,
			value: this.value,
			create: () => {
				opacityText.text(this.value);
			},
			change: (event, ui) => {
				this.onOpacityChange({ opacity: ui.value });
			},
			slide: (event, ui) => {
				opacityText.text(ui.value);
			},
			stop: () => {
				this.contentEditorService.saveState();
			},
		});
	}
}

export var MenuOpacitySliderComponentConfig = {
	template: template,
	bindings: {
		value: "<",
		onOpacityChange: "&",
	},
	controller: MenuOpacitySliderComponent,
};
