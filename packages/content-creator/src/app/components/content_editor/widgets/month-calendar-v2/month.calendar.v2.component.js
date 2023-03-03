/** @format */

"use strict";

import template from "./index.html";
import moment from "moment-timezone";
import SVGClient from "../interactive.component";
// import "./switch.css";

export class MonthCalendarV2Component extends SVGClient {
	static get $inject() {
		return [
			"$scope",
			"$http",
			"$window",
			"$element",
			"$compile",
			"$uibModal",
			"actionMenuService",
			"urlService",
		];
	}

	constructor($scope, $http, $window, $element, $compile, $uibModal, actionMenuService, urlService) {

		super({
			element: $element,
		});

		this.$scope = $scope;
		this.$window = $window;
		this.$http = $http;
		this.$element = $element;
		this.$compile = $compile;
		this.$uibModal = $uibModal;
		this.actionMenuService = actionMenuService;
		this.urlService = urlService;
		this.host = urlService.getWidgets();
		this.domain = document.domain
	}

	async $onInit() {
		this.widgetUrl = this.buildWidgetUrl();

		this.loading = true;
		this.$element.find("object").on("load", () => {
			this.loading = false;
			this.$scope.$applyAsync();
		});

		this.$element.find("object").on("error", () => {
			this.loading = false;
			this.error = true;
			this.$scope.$applyAsync();
		});
		
		document.domain = 'k4connect.com'
		this.$window.onfocus = null;

	}

	$onDestroy() {
		document.domain = this.domain;
	}

	// This modal is called from Action Menu Comp js - in MainSwitchboard function
	buildWidgetUrl() {
		let urlParams = new URLSearchParams(this.$window.location.search);
		let widgetUrl = `${this.host}/calendars/month?communityId=${this.communityid}`;

		if (this.date) {
			widgetUrl += `&month=${moment
				.tz(this.date, this.timezone)
				.format("MMMM")}`;
		} else {
			this.date = new Date();
			widgetUrl += `&month=${moment
				.tz(new Date(), this.timezone)
				.format("MMMM")}`;
		}
		if (this.draft) {
			widgetUrl += `&draft=${this.draft}`;
		}

		if (this.opacity) {
			widgetUrl += `&opacity=${this.opacity}`;
		}

		if (this.size) {
			widgetUrl += `&size=${this.size}`;
		}

		if (this.font) {
			widgetUrl += `&font=${this.font}`;
		}

		if (this.showlogo) {
			widgetUrl += `&showLogo=${this.showlogo}`;
		}

		if (this.showtitle) {
			widgetUrl += `&showTitle=${this.showtitle}`;
		}

		if (this.showmonth) {
			widgetUrl += `&showMonth=${this.showmonth}`;
		}

		if (this.showyear) {
			widgetUrl += `&showYear=${this.showyear}`;
		}

		if (this.locationkey) {
			widgetUrl += `&locationKey=${this.locationkey}`;
		}

		if (this.eventtypekey) {
			widgetUrl += `&eventTypeKey=${this.eventtypekey}`;
		}

		let calendarList = JSON.parse(this.calendar);
		let collectionIds = [];
		for (let index in calendarList) {
			collectionIds.push(calendarList[index].calendarId);
		}
		if (collectionIds.length > 0) {
			widgetUrl += collectionIds.reduce((previous, current) => {
				return (previous += `&calendar=${current}`);
			}, "");
		}
		return widgetUrl;
	}

	handler(ctx, action) {
		console.log(ctx, action)
		if(action) {
			this.openEventInNewTab(action)
		} else {
			console.warn('unable to parse click target')
		}
		return 
	}

	openEventInNewTab(eventUrl) {
		this.$window.onfocus = () => {
			console.log('focused')
			this.$compile(this.$element)(this.$scope);
		}

		let modalInstance = this.$uibModal.open({
      animation: true,
      component: "confirmationModalComponent",
      appendTo: $('#content-creator'),
			resolve: {
				message: function() {
					return "Changing this event will update it in all user interfaces including digital signage, voice, and K4Community Plus."
				},
				confirmAction: () => {
					return () => this.$window.open(`${eventUrl}&from=creator`, "_blank");
				},
				confirmTrackingEvent: () => "30daywidget_edit_confirm",
				cancelTrackingEvent: () => "30daywidget_edit_cancel"
			}
    });
		
	}
}

export var MonthCalendarV2ComponentConfig = {
	template: template,
	bindings: {
		communityid: "=",
		date: "@",
		calendar: "@",
		draft: "@",
		opacity: "@",
		size: "@",
		font: "@",
		showlogo: "@",
		showtitle: "@",
		showmonth: "@",
		showyear: "@",
		locationkey: "@",
		eventtypekey: "@",
	},
	controller: MonthCalendarV2Component,
};
