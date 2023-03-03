"use strict";

import template from "./date-picker.component.html";
import "./date-picker.component.css";

export class DatePickerComponent {
	static get $inject() {
		return [
			"contentEditorService",
			"$scope",
			"$rootScope",
			"$compile",
			"liveWidgetUpdateService",
		];
	}

	constructor(
		contentEditorService,
		$scope,
		$rootScope,
		$compile,
		liveWidgetUpdateService,
	) {
		this.contentEditorService = contentEditorService;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$compile = $compile;
		this.liveWidgetUpdateService = liveWidgetUpdateService;
		this.$scope.$on("elementSelected", (event, element) => {
			this.elementSelected = element;
			this.loadCalendar(element);
		});

		this.$scope.$on("elementUnselected", (event, element) => {
			$("#ui-datepicker-div").remove();
		});
	}

	$onInit() {
		let tooltipElement = angular.element(document.querySelector("#tooltip"));
		const tooltip = "Automatically updates to \n display today's events";
		tooltipElement.attr("data-tip", tooltip);
	}

	$onDestroy() {
		$("#ui-datepicker-div").remove();
	}

	updateWeeksCount(month, year, fromMonday = false) {
		/**
		 * Checks number of weeks
		 * Returns true for 5, false for 6
		 * @param {Number} year - full year (2018)
		 * @param {Number} month - zero-based month index (0-11)
		 * @param {Boolean} fromMonday - false if weeks start from Sunday, true - from Monday.
		 * @returns {Boolean}
		 */

		const first = new Date(year, month, 1);
		const last = new Date(year, month + 1, 0);

		let dayOfWeek = first.getDay();
		if (fromMonday && dayOfWeek === 0) {
			dayOfWeek = 7;
		}

		let days = dayOfWeek + last.getDate();
		if (fromMonday) {
			days -= 1;
		}

		const weekNumber = Math.ceil(days / 7);
		if (weekNumber === 5) {
			return (this.contentEditorService.eventMonthlyWeekCount = true);
		}
		return (this.contentEditorService.eventMonthlyWeekCount = false);
	}

	loadCalendar(element) {
		let calendarComponent = $(element).children()[0];
		let calendarWidget = $(calendarComponent).find(".calendar-widget")[0];
		let dateAttr = $(calendarComponent).attr("date") || new Date();

		this.calendarComponent = calendarComponent;

		$("#datepicker").show();
		let datePickerOptions = {
			dateFormat: "yy-mm-dd",
			altField: "#datepicker",
			defaultDate: dateAttr,
			showButtonPanel: false,
			monthNamesShort: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			],

			onSelect(dateText) {
				$("#datepicker").datepicker("setDate", dateText);
				$(calendarComponent).attr("date", dateText);
			},
		};

		$(".daily-calendar-radio").attr("hidden", true);
		$(".date-tool").removeAttr("hidden");
		$("#datepicker").prop("disabled", false);
		$("#datepicker").removeAttr("style");
		$(".draft-events-checkbox").attr("hidden", true);
		$("#cal-icon").removeAttr("style");

		if (
			$(element).find("month-calendar").length > 0 ||
			$(element).find("month-calendar-v2").length > 0
		) {
			this.contentEditorService.dateLabel = "Month";
			datePickerOptions.altFormat = "MM";
		} else if ($(element).find("day-calendar").length > 0) {
			this.contentEditorService.dateLabel = "Date Option";
			datePickerOptions.altFormat = "D, M dd, yy";
		} else if ($(element).find("week-calendar").length > 0) {
			this.contentEditorService.dateLabel = "Week of";
			datePickerOptions.altFormat = "dd, MM, yy";
		} else {
			this.contentEditorService.dateLabel = "Date Range";
			datePickerOptions.altFormat = "D, M yy";
		}

		// Setup today's events calendar
		if ($(calendarComponent)[0].localName === "event-daily") {
			$(".date-tool").attr("hidden", true);
		}

		// Setup month calendar
		if (
			$(calendarComponent)[0].tagName === "MONTH-CALENDAR" ||
			$(calendarComponent)[0].tagName === "MONTH-CALENDAR-V2"
		) {
			$(".draft-events-checkbox").removeAttr("hidden");
			datePickerOptions.changeMonth = false;

			datePickerOptions.onChangeMonthYear = (year, month, inst) => {
				// jQuery return month from 1 to 12 and IE11 needs it in the format from 01, 02, 03...12
				month = `0${month}`;
				month = month.slice(-2);

				$("#datepicker").datepicker("setDate", `${year}-${month}-${15}`);
				$(calendarComponent).attr("date", `${year}-${month}-${15}`);

				// pass month with 0 index for week check
				this.updateWeeksCount(Number(month) - 1, year);
				// update view w/ timeout to avoid current digest
				this.$scope.$applyAsync();

				this.liveWidgetUpdateService.update.cancel();

				this.liveWidgetUpdateService.update = this.liveWidgetUpdateService.debounce(
					() => {
						this.$compile($(calendarComponent))(this.$scope);
					},
					1000,
					{ trailing: true },
				);

				return this.liveWidgetUpdateService.update();
			};
		}

		// Setup week calendar
		if ($(calendarComponent)[0].tagName === "WEEK-CALENDAR") {
			datePickerOptions.beforeShow = () => {
				this.loadWeekCalendar();
				this.displayCalendar();
			};
			datePickerOptions.onChangeMonthYear = (year, month, inst) => {
				this.loadWeekCalendar();
				this.displayCalendar();
			};
		}

		// Setup day calendar
		if ($(calendarComponent)[0].tagName === "DAY-CALENDAR") {
			$(".daily-calendar-radio").removeAttr("hidden");
			if (calendarComponent.hasAttribute("date")) {
				this.date = dateAttr;
				$("#choose-date-radio").prop("checked", true);
			}
			if (
				!calendarComponent.hasAttribute("date") &&
				!calendarComponent.hasAttribute("auto")
			) {
				const todaysDate = dateAttr.toISOString().substring(0, 10);
				$(calendarComponent).attr("date", todaysDate);
				this.date = todaysDate;
				$("#choose-date-radio").prop("checked", true);
			}
			if (calendarComponent.hasAttribute("auto")) {
				this.date = dateAttr.toISOString().substring(0, 10);
				$("#auto-update-radio").prop("checked", true);
				$("#datepicker").prop("disabled", true);
				$("#datepicker").attr("style", "color:lightgray");
				$("#cal-icon").attr("style", "color:lightgray");
			}
			datePickerOptions.beforeShow = () => {
				this.displayCalendar();
			};
			datePickerOptions.onChangeMonthYear = () => {
				this.displayCalendar();
			};
		}

		$("#ui-datepicker-div").css("display", "none");

		if ($(calendarWidget).hasClass("month-calendar")) {
			$(".ui-datepicker-calendar").css("display", "none");
			$(".ui-datepicker-prev").css("display", "none");
			$(".ui-datepicker-next").css("display", "none");
		}

		datePickerOptions.onSelect = (dateText) => {
			this.date = dateText;
			let dp = $("#datepicker");
			datePickerOptions.defaultDate = dateText;
			dp.datepicker(datePickerOptions);
			$(calendarComponent).attr("date", dateText);

			this.liveWidgetUpdateService.update.cancel();

			this.liveWidgetUpdateService.update = this.liveWidgetUpdateService.debounce(
				() => {
					this.$compile($(calendarComponent))(this.$scope);
				},
				1000,
				{ trailing: true },
			);
			return this.liveWidgetUpdateService.update();
		};

		if (
			$(calendarComponent)[0].tagName === "DAY-CALENDAR" ||
			$(calendarComponent)[0].tagName === "WEEK-CALENDAR" ||
			$(calendarComponent)[0].tagName === "MONTH-CALENDAR" ||
			$(calendarComponent)[0].tagName === "MONTH-CALENDAR-V2"
		) {
			$("#datepicker").datepicker(datePickerOptions);
			$("#datepicker").datepicker("setDate", dateAttr);
		}
	}

	isDraftChecked() {
		if ($(this.calendarComponent).attr("draft")) {
			return true;
		}
		return false;
	}

	onDraftClick() {
		if ($(this.calendarComponent).attr("draft")) {
			$(this.calendarComponent).removeAttr("draft");
		} else {
			$(this.calendarComponent).attr("draft", true);
		}

		this.liveWidgetUpdateService.update.cancel();

		this.liveWidgetUpdateService.update = this.liveWidgetUpdateService.debounce(
			() => {
				this.$compile($(this.calendarComponent))(this.$scope);
			},
			1000,
			{ trailing: true },
		);

		return this.liveWidgetUpdateService.update();
	}

	radioOnChange(value) {
		let calendarComponent = $(this.elementSelected).children()[0];
		if (value === "auto") {
			$("#datepicker").prop("disabled", true);
			$("#datepicker").attr("style", "color:lightgray");
			$("#cal-icon").attr("style", "color:lightgray");
			$(calendarComponent).attr("auto", true);
			$(calendarComponent).removeAttr("date");
			this.date = new Date().toISOString().substring(0, 10);
		} else {
			$("#datepicker").prop("disabled", false);
			$("#datepicker").removeAttr("style");
			$("#cal-icon").removeAttr("style");
			$(calendarComponent).removeAttr("auto");
			$(calendarComponent).attr("date", this.date);
		}

		this.$compile($(calendarComponent))(this.$scope);
	}

	loadWeekCalendar() {
		setTimeout(() => {
			$(".ui-datepicker-current-day")
				.parent()
				.find("a")
				.addClass("ui-state-active");
			$(".ui-datepicker-calendar tbody tr").hover(
				function () {
					$(this).find("a").addClass("hover");
				},
				function () {
					$(this).find("a").removeClass("hover");
				},
			);
		}, 100);
	}

	displayCalendar() {
		setTimeout(() => {
			$(".ui-datepicker-calendar").css("display", "table");
			$(".ui-datepicker-prev").css("display", "inline");
			$(".ui-datepicker-next").css("display", "inline");
		}, 100);
	}
}

export var DatePickerComponentConfig = {
	template: template,
	controller: DatePickerComponent,
};
