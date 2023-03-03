/** @format */

import { Click, Type } from "../interactions";
import Verify from '../assertions/Verify';

/**
 * Widget Tool component namespace
 * @prop {string} button the selector for the Widget Tool button
 *
 */
export const WT = {
	button: `#editor__tile-widgets`,
	backBtn: `#default_back_btn`,
	deleteBtn: `[ng-click="$ctrl.removeElement()"]`,
	canvas: `.slides > .present`,
	loadingSpinner: '.loaderSpinner',
	firstThingOnCanvas: `.slides > .present > .widget-obj`,
	dailyWeatherWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('single-weather')"]`,
		widget: `.weather-day-container`,
		dayOfWeek: `.day_of_week`,
	},
	threeDayWeatherWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('three-day-weather')"]`,
		widget: `.widget-obj three-day-forecast`,
	},
	todaysEventsWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('event-daily')"]`,
		widget: `.no-events`,
	},
	dateTimeWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('date-time')"]`,
		widget: `.date-time`,
	},
	dayCalendarWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('day-calendar')"]`,
		widget: `.eventDay_header`,
	},
	weekCalendarWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('week-calendar')"]`,
		widget: `week-calendar .calendar-widget`,
	},
	
	monthCalendarWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('month-calendar')"]`,
		widget: `month-calendar .calendar-widget`,
	},
	calenderKeyWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('events-location')"]`,
		widget: `.widget-grey-bg`,
	},
    websiteWidget: {
		widgetBtn: `[ng-click="$ctrl.addWidget('external-widget')"]`,
		linkTextbox: `[ng-model="$ctrl.srcUrl"]`,
		widget: `.external-widget > div`,
	},
};

/**
 * This abstracts the actions relating to the WidgetTool
 * @namespace WidgetTool
 */
export default class WidgetTool {
	/**
	 * Method to open the Widget Tool panel
	 */
	static open = () => {
		Click.on(WT.button)
	};

	/**
	 * Method to exit out of Widget tool view
	 */
	static goBack = () => Click.on(WT.backBtn);

	/**
	 * Method to add a daily weather widget to the canvas
	 */
	static addDailyWeather = () => {
		Click.on(WT.dailyWeatherWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Click.on(WT.canvas);
	};
	/**
	 * Method to add an event widget to the canvas
	 */
	 static addThreeDayWidget = () => {
		Click.on(WT.threeDayWeatherWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Click.on(WT.canvas);
	 };
	 /**
	   * Method to add an event widget to the canvas
	   */
	 static addTodaysEventsWidget = () => {
		Click.on(WT.todaysEventsWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Click.on(WT.canvas);
	};
	/**
	 * Method to add an Date/Time widget to the canvas
	 */
	 static addDateTimeWidget = () => {
		Click.on(WT.dateTimeWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Click.on(WT.canvas);
	};
	/**
	   * Method to add an event widget to the canvas
	   */
	static addDayCalendarWidget = () => {
		Click.on(WT.dayCalendarWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Click.on(WT.canvas);
	};
	/**
		 * Method to add an weekly calendar widget to the canvas
		 */
	static addWeeklyCalendarWidget = () => {
		Click.on(WT.weekCalendarWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Click.on(WT.canvas);
	};
	/**
	 * Method to add an monthly calender widget to the canvas
	 */
	static addMonthlyCalendarWidget = () => {
		Click.on(WT.monthCalendarWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Click.on(WT.canvas);
	};
/**
	 * Method to add a calender key widget to the canvas
	 */
 static addCalendarkeyWidget = () => {
	Click.on(WT.calenderKeyWidget.widgetBtn);
	Verify.theElement(WT.loadingSpinner).doesntExist()
	Click.on(WT.canvas);
};


	/**
	 * Method to delete the first widget box that we find
	 */
	static deleteElement = () => {
		Click.on(WT.canvas); //not ideal but will fix later.
		Verify.theElement(WT.websiteWidget.widgetBtn).isntVisible()
		Click.on(WT.firstThingOnCanvas);
		Click.on(WT.deleteBtn);
	};

	/**
	 * Method to add an external website widget to the canvas
	 */
	static addExternalUrlWidget = (website) => {
		Click.on(WT.websiteWidget.widgetBtn);
		Verify.theElement(WT.loadingSpinner).doesntExist()
		Type.theText(website).into(WT.websiteWidget.linkTextbox);
		Click.on(WT.canvas);
	};


	/**
	 * Method to validate the contents of the external widget, not very reusable but could be if we needed to
	 */
	static validateExternalWidgetLoadsElement = (element) => {
		cy.wait(1500) // cant seem to get rid of this wait, doesnt play super nicely with iframe.
		cy.get(WT.websiteWidget.widget).within((widget) => (
			cy.getIframe().within(iframe => {
				Verify.theElement(element).isVisible()
			})
		));
	}
}
