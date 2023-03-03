"use strict";

import template from "./calendar-picker.component.html";
import "./calendar-picker.component.css";
import find from "lodash/find";
import findindex from "lodash/findIndex";
import sortBy from "lodash/sortBy";

export class CalendarPickerComponent {
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
    liveWidgetUpdateService
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$compile = $compile;
    this.urlService = urlService;
    this.masterService = masterService;
    this.liveWidgetUpdateService = liveWidgetUpdateService;

    this.urlParams = this.masterService.getUrlParams();
    this.calendarList = [];

    this.$scope.$on("elementSelected", (event, element) => {
      this.loadCalendar(element);
    });

    this.getCalendars();
  }

  async getCalendars() {
    const response = await this.$http({
      method: "GET",
      url: encodeURI(
        `${this.urlService.getContent()}/calendars?association=${
          this.urlParams.communityId
        }`,
      ),
    });

    const collections = sortBy(response.data, collection => collection.name.toLowerCase());

    for (let index in collections) {
      this.calendarList.push({
        calendarId: collections[index].guid,
        calendarName: collections[index].name,
      });
    }
  }

  $onInit() {
    let tooltipElement = angular.element(
      document.querySelector("#calendarTooltip")
    );
    const tooltip =
      "Events from calendar(s) selected \n below will be displayed in the widget.";
    tooltipElement.attr("data-tool-tip", tooltip);
  }

  loadCalendar(element) {
    this.isAllSelected = false;

    $("#calendarTooltip").attr("hidden", true);
    $("#calendarLabel").removeAttr("hidden");
    this.calendarComponent = $(element).children()[0];
    this.selectedCalendars = [];

    if ($(this.calendarComponent).prop("tagName") === "EVENT-DAILY") {
      $("#calendarTooltip").removeAttr("hidden");
      $("#calendarLabel").attr("hidden", true);
    }

    let allCalendarsArray = this.calendarList.slice(0);

    if (
      $(this.calendarComponent).attr("calendar") &&
      $(this.calendarComponent).attr("calendar") !== "null"
    ) {
      if (JSON.parse($(this.calendarComponent).attr("calendar")).length > 0) {
        this.selectedCalendars = JSON.parse(
          $(this.calendarComponent).attr("calendar")
        );

      } else {
        this.selectedCalendars = allCalendarsArray;
      }
    } else {
      $(this.calendarComponent).attr("calendar", JSON.stringify([]));
      this.selectedCalendars = allCalendarsArray;
    }

    this.calendarList.length === this.selectedCalendars.length
      ? (this.isAllSelected = true)
      : false;

    this.$scope.$applyAsync();
  }

  isDisabled(calendar) {
    return this.selectedCalendars && this.selectedCalendars.length === 1 && calendar.calendarId === this.selectedCalendars[0].calendarId;
  }

  isSelected(calendar) {
    if (find(this.selectedCalendars, (cal) => cal.calendarId === calendar.calendarId)) {
      return true;
    }
    return false;
  }

  toggleCheck(calendar) {

    if (
      this.selectedCalendars.length === 1 // only 1 cal selected, dont let unselect
    ) {
      this.selectedCalendars.push(calendar);
      return;
    }
    if (find(this.selectedCalendars, (cal) => cal.calendarId === calendar.calendarId)) {
      this.selectedCalendars.splice(
        findindex(this.selectedCalendars, (cal) => cal.calendarId === calendar.calendarId),
        1
      );
    } else {
      this.selectedCalendars.push(calendar);
    }
    //all calendars selected then uncheckmark a calendar, uncheckmarkss All Calendars else if individually select all calendars will checkmark All Calendars
    if (this.isAllSelected) {
      this.isAllSelected = false;
    }
    this.updateDomAttribute();
  }

  selectAll() {
    if (this.isAllSelected) {
      this.selectedCalendars = [];
      this.isAllSelected = false;
    } else {
      this.selectedCalendars = Array.from(this.calendarList);
      this.isAllSelected = true;
    }
    this.updateDomAttribute();
  }

  updateDomAttribute() {
    this.liveWidgetUpdateService.update.cancel();
    let calendarArray = this.isAllSelected ? [] : this.selectedCalendars;
    calendarArray =
      !this.isAllSelected && this.selectedCalendars.length === 0
        ? null
        : calendarArray;

    let widgetEl = angular.element(this.calendarComponent);
    widgetEl.attr("calendar", JSON.stringify(calendarArray));

    this.liveWidgetUpdateService.update = this.liveWidgetUpdateService.debounce(
      () => {
        this.$compile(widgetEl)(this.$scope);
      },
      1000,
      { trailing: true }
    );
    return this.liveWidgetUpdateService.update();
  }
}

export var CalendarPickerComponentConfig = {
  template: template,
  controller: CalendarPickerComponent,
};
