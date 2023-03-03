/** @format */

"use strict";

import template from "./restaurant-picker.component.html";
import "./restaurant-picker.component.css";

export class RestaurantPickerComponent {
	onSelect(restaurant) {
		this.onRestaurantChange({ restaurant: restaurant.id });
	}
}

export var RestaurantPickerComponentConfig = {
	template,
	bindings: {
		restaurants: "<",
		restaurant: "=",
		onRestaurantChange: "&",
	},
	controller: RestaurantPickerComponent,
};
