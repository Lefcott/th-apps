/** @format */

"use strict";

import template from "./index.html";
import queryString from "query-string";
import moment from "moment-timezone";

export class MenuWeeklyComponent {
	static get $inject() {
		return [
			"$scope",
			"$http",
			"$window",
			"$element",
			"urlService",
			"masterService",
		];
	}

	constructor($scope, $http, $window, $element, urlService, masterService) {
		this.$scope = $scope;
		this.$http = $http;
		this.$window = $window;
		this.$element = $element;
		this.urlService = urlService;
		this.masterService = this.masterService;
		this.host = urlService.getWidgets();

		const params = masterService.getUrlParams();
		this.orientation = params.orientation;
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

		if (!this.menuWeek || !this.menuMeals || !this.orientation) return;

		const widgetUrl = `${this.host}/menus/week`;
		const meals = this.menuMeals ? this.menuMeals.split(",") : [];
		const week = moment(this.menuStartDate).add("weeks", this.menuWeek);
		const params = {
			communityId: this.communityId,
			restaurant: this.restaurant,
			menu: this.menu,
			week: week.toISOString(),
			showLogo: this.showLogo,
			showRestaurant: this.showRestaurant,
			showMenu: this.showMenu,
			meals,
			opacity: this.opacity,
		};

		return `${widgetUrl}?${queryString.stringify(params, {
			arrayFormat: "none",
		})}`;
	}
}

export const MenuWeeklyComponentConfig = {
	template: template,
	bindings: {
		communityId: "=",
		restaurant: "@",
		menu: "@",
		menuWeek: "@",
		menuMeals: "@",
		menuStartDate: "@",
		opacity: "@",
		showLogo: "@",
		showRestaurant: "@",
		showMenu: "@",
	},
	controller: MenuWeeklyComponent,
};
