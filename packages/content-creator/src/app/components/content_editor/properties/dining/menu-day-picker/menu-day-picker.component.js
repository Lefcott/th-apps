/** @format */

"use strict";

import template from "./menu-day-picker.component.html";
import range from "lodash/range";
import moment from "moment-timezone";

export class MenuDayPickerComponent {
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
			days: [],
		};
	}

	$onChanges(changes) {
		if (changes.menu) this.getDayDates(changes.menu.currentValue);
	}

	onSelect(day) {
		this.onMenuDayChange({ day });
	}

	getDateByDay(day) {
		if (!this.menu) return;

		if (day === null)
			return {
				text: "Today's date",
				value: null,
			};

		const date = moment(this.menu.startDate);
		date.add(day, "days").startOf("day");
		return {
			text: date.format("MMMM D"),
			value: day,
		};
	}

	getDayDates(menu) {
		if (!menu) return;

		const { startDate, endDate } = menu;
		const start = moment(startDate).startOf("day");
		const end = moment(endDate).endOf("day");

		const numOfDays = end.diff(start, "days");
		const days = range(0, numOfDays + 1); // include the last day;
		const dayOptions = days.map((dayNum) => this.getDateByDay(dayNum));

		this.$scope.data.days = dayOptions;
	}
}

export var MenuDayPickerComponentConfig = {
	template,
	bindings: {
		menu: "<",
		menuDay: "<",
		onMenuDayChange: "&",
	},
	controller: MenuDayPickerComponent,
};
