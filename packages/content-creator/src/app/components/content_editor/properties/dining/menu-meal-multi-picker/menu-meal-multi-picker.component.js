/** @format */

"use strict";

import template from "./menu-meal-multi-picker.component.html";

export class MenuMealMultiPickerComponent {
	static get $inject() {
		return ["$scope"];
	}

	constructor($scope) {
		this.$scope = $scope;
	}

	$onInit() {
		this.$scope.value = [];
	}

	onToggle(meal) {
		const meals = [...this.menuMeals];
		const exists = meals.find((x) => x === meal.id);
		if (exists) {
			this.onMenuMealsChange({
				meals: meals.filter((x) => x !== exists),
			});
		} else {
			this.onMenuMealsChange({ meals: [...this.menuMeals, meal.id] });
		}
	}

	getMealsFromMenu() {
		return;
	}

	isToggled(meal) {
		return !!this.menuMeals.find((id) => id === meal.id);
	}

	isDisabled(meal) {
		const mealEnabled = this.menuMeals.find((id) => id === meal.id);
		return this.menuMeals.length === 1 && mealEnabled;
	}
}

export var MenuMealMultiPickerComponentConfig = {
	template,
	bindings: {
		menu: "<",
		menuMeals: "<",
		onMenuMealsChange: "&",
	},
	controller: MenuMealMultiPickerComponent,
};
