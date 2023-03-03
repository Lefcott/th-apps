/** @format */

"use strict";

import template from "./menu-meal-picker.component.html";

export class MenuMealPickerComponent {
	static get $inject() {
		return ["$scope"];
	}

	onSelect(meal) {
		this.onMenuMealsChange({
			meals: [meal.id],
		});
	}
}

export var MenuMealPickerComponentConfig = {
	template,
	bindings: {
		menu: "<",
		menuMeal: "<",
		onMenuMealsChange: "&",
	},
	controller: MenuMealPickerComponent,
};
