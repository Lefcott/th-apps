/** @format */

"use strict";

import template from "./menu-week-picker.component.html";
import range from "lodash/range";
import moment from "moment-timezone";
import "./menu-week-picker.component.css";

export class MenuWeekPickerComponent {
	static get $inject() {
		return [
			"$scope",
			"$http",
			"urlService",
			"masterService",
			"$rootScope",
			"$compile",
			"liveWidgetUpdateService",
		];
	}

	constructor(
		$scope,
		$http,
		urlService,
		masterService,
		$rootScope,
		$compile,
		liveWidgetUpdateService,
	) {
		this.$scope = $scope;
		this.$http = $http;
		this.urlService = urlService;
		this.masterService = masterService;
		this.$rootScope = $rootScope;
		this.$compile = $compile;
		this.liveWidgetUpdateService = liveWidgetUpdateService;

		this.urlParams = this.masterService.getUrlParams();
		this.$scope.data = {
			weeks: [],
		};
	}

	$onChanges(changes) {
		if (changes.menu) this.getWeekDates(changes.menu.currentValue);
	}

	onSelect(week) {
		this.onMenuWeekChange({ week });
	}

	getDateByWeek(week) {
		if (!this.menu) return;

		const date = moment(this.menu.startDate);
		date.add(week, "weeks").startOf("week");
		return {
			text: date.format("MMMM D"),
			value: week,
		};
	}

	getWeekDates(menu) {
		if (!menu) return;

		const { startDate, endDate } = menu;
		const start = moment(startDate);
		const end = moment(endDate);
		const numOfWeeks = end.diff(start, "week") + 1;
		const weeks = range(0, numOfWeeks);
		const weekOptions = weeks.map((weekNum) => this.getDateByWeek(weekNum));
		const currentWeek = moment().diff(moment(startDate), "weeks");

		this.$scope.data.weeks = weekOptions;
		this.$scope.$ctrl.menuWeek = Math.min(currentWeek, numOfWeeks - 1);
	}
}

export var MenuWeekPickerComponentConfig = {
	template,
	bindings: {
		menu: "<",
		menuWeek: "<",
		onMenuWeekChange: "&",
	},
	controller: MenuWeekPickerComponent,
};
