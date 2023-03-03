/** @format */

"use strict";

import template from "./menu-picker.component.html";
import "./menu-picker.component.css";

export class MenuPickerComponent {
	onSelect(menu) {
		this.onMenuChange({ menu: menu.id });
	}
}

export var MenuPickerComponentConfig = {
	template,
	bindings: {
		menus: "<",
		menu: "<",
		onMenuChange: "&",
	},
	controller: MenuPickerComponent,
};
