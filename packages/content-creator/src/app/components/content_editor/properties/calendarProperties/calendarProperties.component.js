/** @format */

"use strict";

import template from "./calendarProperties.component.html";
import "./calendarProperties.component.css";

export class CalendarPropertiesComponent {
	static get $inject() {
		return ["$scope", "$compile", "contentEditorService"];
	}

	constructor($scope, $compile, contentEditorService) {
		this.$scope = $scope;
		this.$compile = $compile;
		this.contentEditorService = contentEditorService;
		this.$scope.$on("elementSelected", (event, element) => {
			this.calendarWidget = $($(element).children()[0]);
			this.loadProperties(element);
		});
	}

	$onInit() {
		this.calendarOptions = [
			{
				name: "Show Logo",
				status: true,
				val: "showlogo",
			},
			{
				name: "Show Title",
				status: true,
				val: "showtitle",
			},
			{
				name: "Show Month",
				status: true,
				val: "showmonth",
			},
			{
				name: "Show Year",
				status: true,
				val: "showyear",
			},
			{
				name: "Show Location Key",
				status: true,
				val: "locationkey",
			},
			{
				name: "Show Event Types",
				status: true,
				val: "eventtypekey",
			},
		];
	}

	toggleCheck(option) {
		this.calendarOptions = this.calendarOptions.map((o) => {
			if (o.name === option.name) {
				o.status = !o.status;
				this.calendarWidget.attr(option.val, option.status);
			}
			return o;
		});

		this.handleMonthYearToggle();

		this.$compile(this.calendarWidget)(this.$scope);
		this.contentEditorService.saveState();
	}

	handleMonthYearToggle() {
		let monthVal = this.calendarOptions.filter((o) => o.name == "Show Month")[0]
			.status;
		let yearVal = this.calendarOptions.filter((o) => o.name == "Show Year")[0]
			.status;

		let disableMonth = false;
		if (yearVal) {
			disableMonth = true;
			monthVal = true;
		}

		this.calendarOptions = this.calendarOptions.map((o) => {
			if (o.name === "Show Month") {
				o.disabled = disableMonth;
				o.status = monthVal;
			}
			return o;
		});
	}

	loadProperties(element) {
		let calendarOpacity = this.calendarWidget.attr("opacity");
		let opacityHandle = $("#calendar-opacity-custom-handle");
		let opacityText = $("#calendar-opacity-text");
		let applyOpacityDiv;

		if ($(element).hasClass("text-box")) {
			//Apply to div with id of text-editor
			applyOpacityDiv = element.children[0].children[0];
		} else {
			applyOpacityDiv = $(element).find(":first-child");
		}

		// Load opacity from selected element
		let value = $(applyOpacityDiv).css("opacity");

		// Setup opacity slider
		$("#calendar-opacity-slider").slider({
			min: 5,
			max: 100,
			value: calendarOpacity,
			create: () => {
				opacityText.text($("#calendar-opacity-slider").slider("value"));
			},
			change: () => {
				opacityText.text($("#calendar-opacity-slider").slider("value"));
			},
			slide: (event, ui) => {
				opacityText.text($("#calendar-opacity-slider").slider("value"));
			},
			stop: (event, ui) => {
				opacityText.text(ui.value);
				let opacity = ui.value;
				this.updateOpacity(opacity);
			},
		});

		$.each(this.calendarWidget[0].attributes, (i) => {
			const attr = this.calendarWidget[0].attributes[i];

			this.calendarOptions.map((o) => {
				if (o.val === attr.name) {
					o.value = attr.value == "true";
					o.status = o.value;
				}
				return o;
			});
		});

		this.handleMonthYearToggle();
		this.$scope.$applyAsync();
	}

	updateOpacity(val) {
		this.calendarWidget.attr("opacity", val);
		this.$compile(this.calendarWidget)(this.$scope);
		// this.$scope.$applyAsync();
	}
}

export var CalendarPropertiesComponentConfig = {
	template: template,
	controller: CalendarPropertiesComponent,
};
