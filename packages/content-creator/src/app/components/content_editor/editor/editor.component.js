/** @format */

"use strict";

import template from "./editor.html";
import Calendar5Week from "../../../assets/svg/calendar-5-week.svg";
import Calendar6Week from "../../../assets/svg/calendar-6-week.svg";
import Circle from "../../../assets/svg/circle.svg";
import Line from "../../../assets/svg/line.svg";
import Rectangle from "../../../assets/svg/rectangle.svg";
import ImagePlaceholder from "../../../assets/svg/image_placeholder.svg";

import "./editor.css";

const SVG = {
	"calendar-5-week": Calendar5Week,
	"calendar-6-week": Calendar6Week,
	circle: Circle,
	line: Line,
	rectangle: Rectangle,
	image_placeholder: ImagePlaceholder,
};

export class EditorComponent {
	static get $inject() {
		return [
			"$scope",
			"$compile",
			"urlService",
			"contentEditorService",
			"masterService",
			"featureFlagService",
			"canvasService",
		];
	}

	constructor(
		$scope,
		$compile,
		urlService,
		contentEditorService,
		masterService,
		featureFlagService,
		canvasService
	) {
		this.$scope = $scope;
		this.$compile = $compile;
		this.featureFlagService = featureFlagService;
		this.canvasService = canvasService;
		this.urlService = urlService;
		this.contentEditorService = contentEditorService;
		this.masterService = masterService;
		this.urlParams = this.masterService.getUrlParams();
		this.initialized = false;

		this.$scope.$on("canvasInitialized", () => {
			this.initialized = true;
			// this.addWidget("menu-daily");
		});

		this.$scope.$on("elementSelected", (event, element) => {
			this.widgetOrPageProperties(null);
			this.loadProperties(element);
		});

		this.$scope.$on("elementUnselected", (event, element) => {
			this.widgetOrPageProperties(null);
			this.loadProperties(element);
		});

		this.loadProperties(null);
		this.widgetOrPageProperties(null);
	}

	back() {
		this.contentEditorService.clearCurrent();
		this.widgetOrPageProperties(null);
	}

	addShape(type) {
		const svg = SVG[type];

		this.contentEditorService.currentSlide.append(svg);
		this.contentEditorService.saveState();

		if (type == "line") {
			$(".present .line")
				.mousedown(
					$.proxy(
						this.contentEditorService.mouseDown,
						this.contentEditorService,
					),
				)
				.trigger("mousedown");
		} else {
			$(".present .shape")
				.mousedown(
					$.proxy(
						this.contentEditorService.mouseDown,
						this.contentEditorService,
					),
				)
				.trigger("mousedown");
		}
		Reveal.sync();
	}

	addImage() {
		let image = document.createElement("div");
		$(image).addClass("image-obj unrestricted");
		$(image).append("<image-component></image-component>");

		this.contentEditorService.currentSlide.append(
			this.$compile(image)(this.$scope),
		);
		this.contentEditorService.saveState();

		$(".image-obj").mousedown(
			$.proxy(this.contentEditorService.mouseDown, this.contentEditorService),
		);

		$(".present  .image-obj").last().addClass("selected").trigger("mousedown");
		Reveal.sync();
	}

	addWidget(widgetType) {
		let widget = document.createElement("div");
		$(widget).addClass("widget-obj");
		let canvasWidth = $(".slides").width();
		this.widgetWidth = canvasWidth * 0.3;
		let widgetDimensions;

		if (widgetType == "single-weather") {
			$(widget).append(
				'<weather-widget data-aspectratio="1.33"></weather-widget>',
			);
			$(widget).addClass("widget-obj-4-3");
			widgetDimensions = 1.33;
			if (this.canvasService.isPortrait()) {
				$(widget).attr("fullscreen", true);
			}
		} else if (widgetType == "three-day-weather") {
			$(widget).append(
				'<three-day-forecast data-aspectratio="2.28"></three-day-forecast>',
			);
			$(widget).addClass("widget-obj-16-7");
			widgetDimensions = 2.28;
			if (this.canvasService.isPortrait()) {
				$(widget).attr("fullscreen", true);
			}
		} else if (widgetType == "event-daily") {
			$(widget).append(
				'<event-daily data-aspectratio="1.77" calendar="[]"></event-daily>',
			);
			$(widget).addClass("widget-obj-16-9");
			widgetDimensions = 1.77;
		} else if (widgetType == "date-time") {
			$(widget).append("<date-time></date-time>");
			$(widget).addClass("widget-obj-1-1 unrestricted");
			widgetDimensions = 1.66;
		} else if (widgetType == "day-calendar") {
			$(widget).append(
				`<day-calendar style="background-color: rgba(255, 255, 255, 0.5); width:100%; height:100%; display:block; overflow:hidden;" communityid="${this.urlParams.communityId}" calendar="[]"></day-calendar>`,
			);
			$(widget).addClass("widget-obj-1-1 unrestricted");
			widgetDimensions = 1;
		} else if (widgetType == "week-calendar") {
			$(widget).addClass("widget-obj-1-1 unrestricted");
			// larger initial widget size
			$(widget).append(
				`<week-calendar style="width:100%;height:100%; display:block;" communityid="${this.urlParams.communityId}" calendar="[]"></week-calendar>`,
			);
		} else if (widgetType == "month-calendar") {
			// larger initial widget size
			// Aspect ratio for 11x17 - 1.55
			$(widget).append(
				// `<month-calendar style="width:100%;height:100%; display:block;" class="month-calendar-comp" data-aspectratio="1.55" communityid="${this.urlParams.communityId}" calendar="[]"></month-calendar>`
				`<month-calendar-v2 data-aspectratio="1.54" calendar="[]" communityid="${this.urlParams.communityId}" showlogo="true" showtitle="true" showmonth="true" showyear="true" locationkey="true" eventtypekey="true" opacity="100" size="full"></month-calendar-v2>`,
			);
			$(widget).addClass("widget-obj-11-7-monthly-cal widget-month-cal-v2 ");
			// $(widget).addClass("widget-obj-1-1 unrestricted");
			// $(widget).attr("fullscreen", true);
			widgetDimensions = 1.55;
		} else if (widgetType == "events-location") {
			$(widget).addClass("location-calendar-widget unrestricted");
			$(widget).append(
				`<location-calendar communityid="${this.urlParams.communityId}"></month-calendar>`,
			);
			widgetDimensions = 1;
		} else if (widgetType == "external-widget") {
			$(widget).append(
				'<external-widget class="external-widget" data-aspectratio="1.77" ></external-widget>',
			);
			$(widget).addClass("widget-obj-16-9");
		} else if (widgetType === "menu-weekly") {
			$(widget).attr("fullscreen", true);
			$(widget).addClass("unrestricted widget-obj-4-3-weekly-menu");
			$(widget).append(
				`<menu-weekly-widget 
				class="widget-menu-weekly"
				community-id="${this.urlParams.communityId}"></menu-weekly-widget>`,
			);
		} else if (widgetType === "menu-daily") {
			$(widget).addClass("unrestricted widget-obj-16-9");
			$(widget).attr("fullscreen", true);
			$(widget).append(
				`<menu-daily-widget class="widget-menu-daily"
					restaurant="null"
					menu="null"
					menu-meals="[]"
					menu-day=""
					menu-week=""
					include-descriptions=""
					opacity="100"
				community-id="${this.urlParams.communityId}" ></menu-daily-widget>`,
			);
		} else if (widgetType === "menu-daily-special") {
			$(widget).addClass("unrestricted");
			$(widget).attr("fullscreen", true);
			$(widget).append(
				`<menu-daily-special-widget class="widget-menu-daily-special"
					restaurant="null"
					menu="null"
					menu-meals="[]"
					menu-day=""
					menu-week=""
					menu-item=""
					fullscreen="false"
					include-descriptions=""
					opacity="100"
					community-id="${this.urlParams.communityId}"></menu-daily-special-widget>`,
			);
		}

		this.contentEditorService.currentSlide.append(
			this.$compile(widget)(this.$scope),
		);

		this.setWidgetDimensions(widgetDimensions, $(widget));
		this.contentEditorService.saveState();

		$(".widget-obj").mousedown(
			$.proxy(this.contentEditorService.mouseDown, this.contentEditorService),
		);

		$(".present .widget-obj").last().addClass("selected").trigger("mousedown");
		Reveal.sync();
	}

	addText() {
		let text = document.createElement("div");
		$(text).addClass("text-box");
		$(text).append("<text-component></text-component>");

		this.contentEditorService.currentSlide.append(
			this.$compile(text)(this.$scope),
		);
		this.contentEditorService.saveState();

		$(".text-box").mousedown(
			$.proxy(this.contentEditorService.mouseDown, this.contentEditorService),
		);
		$(".present .text-box").last().addClass("selected").trigger("mousedown");

		Reveal.sync();
	}

	pageProperties() {
		let propertiesModal = document.createElement("div");
		$(propertiesModal).append(
			this.$compile("<page-properties-component></page-properties-component>")(
				this.$scope,
			),
		);
	}

	loadProperties(element) {
		if (element && !this.contentEditorService.lockStyle) {
			$(".editor__tiles-container").hide();
			$(".zoom-component").hide();
			$(".element-properties").show();
			$(".property__elementremove-container").show();
		} else {
			$(".editor__tiles-container").show();
			$(".zoom-component").show();
			$(".element-properties").hide();
			$(".property__elementremove-container").hide();
		}
	}

	widgetOrPageProperties(type) {
		if (type == "widget") {
			$(".editor__tiles-container").hide();
			$(".zoom-component").hide();
			$(".tiles__widget").show();
		} else if (type == "shape") {
			$(".editor__tiles-container").hide();
			$(".zoom-component").hide();
			$(".tiles__shape").show();
		} else {
			$(".editor__tiles-container").show();
			$(".zoom-component").show();
			$(".tiles__shape").hide();
			$(".tiles__page").hide();
			$(".tiles__widget").hide();
		}
	}

	setWidgetDimensions(aspectRatio, widget) {
		const widgetMinWidth = parseInt($(widget).css("min-width"), 10);
		if (this.widgetWidth <= widgetMinWidth) {
			$(widget).css("width", widgetMinWidth);
			$(widget).css("height", widgetMinWidth / aspectRatio);
		} else {
			$(widget).css("width", this.widgetWidth);
			$(widget).css("height", this.widgetWidth / aspectRatio);
		}
	}
}

export var EditorComponentConfig = {
	template: template,
	controller: EditorComponent,
};
