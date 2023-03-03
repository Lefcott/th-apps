/** @format */

"use strict";

import template from "./menu-item-picker.component.html";

export class MenuItemPickerComponent {
	static get $inject() {
		return ["$scope", "$http", "urlService"];
	}

	constructor($scope, $http, urlService) {
		this.$scope = $scope;
		this.$http = $http;
		this.urlService = urlService;
	}

	$onInit() {
		this.$scope.data = {
			menuItems: [],
		};
	}

	onSelect(item) {
		this.onMenuItemChange({
			item: item._id,
		});
	}
}

export var MenuItemPickerComponentConfig = {
	template,
	bindings: {
		menu: "<",
		menuMeals: "<",
		menuItem: "<",
		menuItems: "<",
		onMenuItemChange: "&",
	},
	controller: MenuItemPickerComponent,
};
