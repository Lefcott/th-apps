/** @format */

import template from "./header-properties.component.html";

export class HeaderPropertiesComponent {
	static get $inject() {
		return ["$scope", "headerPropertiesService"];
	}

	constructor($scope, headerPropertiesService) {
		this.headerPropertiesService = headerPropertiesService;
		this.$scope = $scope;
		this.$scope.value = [];
	}

	onSelect(restaurant) {
		this.onRestaurantChange({ restaurant: restaurant.id });
	}

	onToggle(property) {
		this.onMenuPropertyChange({
			property,
			value:
				!this.headerPropertiesService.optionsBySlide[
					this.headerPropertiesService.currentSlideNumber
				][property],
		});
		this.headerPropertiesService.setSlideProperty(
			property,
			!this.headerPropertiesService.optionsBySlide[
				this.headerPropertiesService.currentSlideNumber
			][property],
		);
	}

	onSlideChange(slideNumber) {
		this.headerPropertiesService.changeSlide(slideNumber);
		this.headerPropertiesService.setSlideProperty("showLogo", true);
		this.headerPropertiesService.setSlideProperty("showRestaurant", true);
		this.headerPropertiesService.setSlideProperty("showMenu", true);
	}

	isToggled(property) {
		const isToggled =
			!!this.headerPropertiesService.optionsBySlide[
				this.headerPropertiesService.currentSlideNumber
			][property];
		return isToggled;
	}
}

export const HeaderPropertiesComponentConfig = {
	template,
	bindings: {
		showLogo: "<",
		showRestaurant: "<",
		showMenu: "<",
		onMenuPropertyChange: "&",
	},
	controller: HeaderPropertiesComponent,
};
