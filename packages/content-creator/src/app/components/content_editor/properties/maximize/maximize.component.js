/** @format */

"use strict";

import template from "./maximize.component.html";

export class MaximizeComponent {
	static get $inject() {
		return ["$scope", "contentEditorService", "canvasService", "$rootScope"];
	}

	constructor($scope, contentEditorService, canvasService, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.contentEditorService = contentEditorService;
		this.canvasService = canvasService;
		this.element;
		this.$scope.$on("elementSelected", (event, element) => {
			this.element = element;
			this.toggled = $(this.element).attr("fullscreen") === "true";
			if (this.toggled) {
				this.setMaximizeStyle();
			}
		});
	}

	$onInit() {
		this.toggled = $(this.element).attr("fullscreen") === "true";
	}

	maximize() {
		//un maximaize back to last state
		if ($(this.element).attr("fullscreen") === "true") {
			this.element.style.cssText = $(this.element).attr("fullscreenprevstyle");
			$(this.element).attr("fullscreen", "false");
		} else if (
			$(this.element).attr("fullscreen") === "false" ||
			$(this.element).attr("fullscreen") === undefined
		) {
			//saves element's previous style in attribute
			$(this.element).attr("fullscreen", "true");
			$(this.element).attr("fullscreenprevstyle", this.element.style.cssText);

			this.setMaximizeStyle();
		}

		this.contentEditorService.saveState();
		this.$rootScope.$broadcast("resized");

		const widgetEl = $(this.element)[0].children[0];
		this.$rootScope.$broadcast("reloadWidget", widgetEl);
	}

	setMaximizeStyle() {
		const orientation = this.canvasService.orientation;
		const canvas = this.canvasService.canvasOrientations[orientation];
		const aspectRatio = this.element.clientHeight / this.element.clientWidth;

		const maxHeight = canvas.height;
		const maxWidth = canvas.width;
		
		this.element.style.width = "100%";
		//get new height
		const newHeight = $(this.element).hasClass("unrestricted")
			? canvas
				? `${canvas.height}`
				: "100%"
			: `${this.element.clientWidth * aspectRatio}`;

		//now make width calulated 100%
		this.element.style.width = `${this.element.clientWidth}px`;
		this.element.style.height = `${newHeight}px`;
		this.element.style.top = 0;
		this.element.style.left = 0;

		if(newHeight > maxHeight) {
			console.log('yep')
			this.element.style.height = `${maxHeight}px`;;
			this.element.style.width =  `${this.element.clientHeight / aspectRatio}px`
		}
	}
}

export var MaximizeComponentConfig = {
	template: template,
	controller: MaximizeComponent,
};
