/** @format */

"use strict";

import template from "./menu-properties.component.html";
import "./menu.properties.component.css";

export class MenuPropertiesComponent {
	static get $inject() {
		return ["$scope", "contentEditorService"];
	}

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.$scope.value = [];
		this.contentEditorService = contentEditorService;
	}

	onToggle(property) {
		this.onMenuPropertyChange({
			property,
			value: !this[property],
		});
	}

	isToggled(property) {
		return !!this[property];
	}
}

export var MenuPropertiesComponentConfig = {
	template,
	bindings: {
		includeDescriptions: "<",
		includeCategories: "<",
		includeImages: "<",
		onMenuPropertyChange: "&",
	},
	controller: MenuPropertiesComponent,
};
