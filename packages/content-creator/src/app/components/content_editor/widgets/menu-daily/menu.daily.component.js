/** @format */

"use strict";

import template from "./index.html";
import queryString from "query-string";
import moment from "moment-timezone";

export class MenuDailyComponent {
	static get $inject() {
		return [
			"$scope",
			"$http",
			"$window",
			"$element",
			"urlService",
			"canvasService",
		];
	}

	constructor($scope, $http, $window, $element, urlService, canvasService) {
		this.$scope = $scope;
		this.$http = $http;
		this.$window = $window;
		this.$element = $element;
		this.urlService = urlService;
		this.canvasService = canvasService;
		this.host = urlService.getWidgets();
	}

	$onChanges(changes) {
		this.$scope.widgetUrl = this.buildWidgetUrl();
	}

	async $onInit() {
		this.$scope.placeholderText = "";
		this.$scope.widgetUrl = this.buildWidgetUrl();
		this.loading = !this.$scope.placeholderText;

		setTimeout(() => {
			this.$element.find("object").on("load", () => {
				this.loading = false;
				this.$scope.$applyAsync();
			});

			this.$element.find("object").on("error", () => {
				this.loading = false;
				this.error = true;
				this.$scope.$applyAsync();
			});
		}, 0);
	}

	buildWidgetUrl() {
		this.$scope.placeholderText = "";

		if (!this.restaurant) {
			this.$scope.placeholderText = "No restaurant available";
			return;
		}

		if (!this.menu) {
			this.$scope.placeholderText = "No menu available";
			return;
		}

		if (!this.restaurant || !this.menu || !this.menuMeals) return;

		const widgetUrl = `${this.host}/menus/daily`;
		const meal = this.menuMeals ? this.menuMeals.split(",")[0] : [];

		const isPortrait = this.canvasService.isPortrait();
		const size = isPortrait ? "portrait" : "large";

		const params = {
			communityId: this.communityId,
			restaurant: this.restaurant,
			menu: this.menu,
			meal: meal,
			includeDescriptions: this.includeDescriptions,
			showLogo: this.showLogo,
			showRestaurant: this.showRestaurant,
			showMenu: this.showMenu,
			opacity: this.opacity,
			size,
		};

		if (this.menuDay !== null && this.menuDay !== undefined) {
			params["day"] = moment(this.menuStartDate)
				.add(this.menuDay, "days")
				.toISOString();
		}

		return `${widgetUrl}?${queryString.stringify(params, {
			arrayFormat: "none",
		})}`;
	}
}

export const MenuDailyComponentConfig = {
	template: template,
	bindings: {
		communityId: "=",
		restaurant: "@",
		menu: "@",
		menuDay: "@",
		menuMeals: "@",
		menuStartDate: "@",
		includeDescriptions: "@",
		showLogo: "@",
		showRestaurant: "@",
		showMenu: "@",
		opacity: "@",
	},
	controller: MenuDailyComponent,
};
