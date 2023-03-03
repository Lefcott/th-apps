/** @format */

import { isNumber } from "ui-router-core";

("use strict");

export default class ContentEditorService {
	static get $inject() {
		return ["$rootScope", "masterService"];
	}

	constructor($rootScope, masterService) {
		this.$rootScope = $rootScope;
		this.masterService = masterService;

		// Grid
		this.space = 55;
		this.canvas = null;
		this.gridEnabled = false;

		// Slide editor
		this.currentSlide = null;
		this.currentSelected = null;
		this.isWidget = false;
		this.isImg = false;
		this.isCalendarWidget = false;
		this.isMenuWeekly = false;
		this.isMenuDaily = false;
		this.isMenuDailySpecial = false;
		this.isShape = false;
		this.isText = false;
		this.isCircle = false;
		this.isLine = false;
		this.currentSlideNumber = 1;
		this.totalSlideNumber = 1;
		this.slideRemove = false;
		this.slideShowReady = false;
		this.stackMap = [];
		this.maxStateStackLength = 20;
		this.editingText = false;
		this.dirty = false;

		// Properties from Dashboard
		this.urlParams = this.masterService.getUrlParams();
		this.isTemplate = this.urlParams.template;
		this.isEditor = this.urlParams.role == "editor";

		// General
		this.originalZoomScale = null;
		this.zoomScale = 1;
		this.settings; // Value set by settings.service.js
		this.dateLabel = "Date Range";

		//widget attributes that should refresh on load
		this.dynamicAttributes = [
			{
				name: "communityid",
				value: this.urlParams.communityId,
			},
		];
	}

	createGrid(width, height) {
		var slides = $(".slides");
		var width = slides.outerWidth();
		var height = slides.outerHeight();
		var grid = $("#grid");

		var gridEl = grid[0];
		gridEl.width = width;
		gridEl.height = height;
		grid.show();
		this.currentSlide = $("section.present");
		this.slideShowReady = true;
	}

	redraw(guides) {
		this.canvas = $("#grid")[0];
		var context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		context.beginPath();

		for (var x = 0; x <= this.canvas.width; x += this.space) {
			context.moveTo(0.5 + x, 0);
			context.lineTo(0.5 + x, this.canvas.height);
		}

		for (var y = 0; y <= this.canvas.height; y += this.space) {
			context.moveTo(0, 0.5 + y);
			context.lineTo(this.canvas.width, 0.5 + y);
		}

		context.strokeStyle = "#888";
		context.lineWidth = 0.5;
		context.stroke();

		if (guides) {
			context.beginPath();

			if (typeof guides.top == "number") {
				context.moveTo(0, 0.5 + guides.top);
				context.lineTo(this.canvas.width, 0.5 + guides.top);
			}

			if (typeof guides.left == "number") {
				context.moveTo(0.5 + guides.left, 0);
				context.lineTo(0.5 + guides.left, this.canvas.height);
			}

			context.strokeStyle = "#ac12c4";
			context.lineWidth = 3;
			context.stroke();
		}
	}

	setup() {
		$(".slides").mousedown(() => {
			this.clearCurrent();
		});

		$(".navigate-left, .navigate-right").mousedown(() => {
			this.clearCurrent();
			this.currentSlide = $("section.present");
		});

		$(".pageproperties__tile").on("click", () => {
			this.$rootScope.$broadcast(
				"backgroundSelected",
				document.querySelector("section.present"),
			);
		});

		Reveal.addEventListener("slidechanged", (event) => {
			this.initPageState();
		});
	}

	initPageState(newPage) {
		let i = this.currentSlideNumber - 1;

		if (newPage) {
			this.stackMap.splice(i, 0, null);
		}

		if (this.stackMap[i]) {
			return;
		}

		this.stackMap[i] = {
			current: 0,
			stack: [$(document).find("section")[i].outerHTML],
		};
	}

	weekCount(month, year, fromMonday) {
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
		this.eventMonthlyWeekCount = weekNumber === 5 ? true : false;
	}

	mouseDown(event) {
		event.preventDefault();
		event.stopPropagation();

		let element = event.currentTarget;

		if (this.currentSelected != element) {
			this.clearCurrent();

			this.currentSelected = element;
			this.enableDrag(element);
			this.enableResize(element);
			this.checkPermissions(element);

			if ($(element).hasClass("widget-obj")) {
				this.isWidget = true;
				this.isCalendarWidget = false;
				this.isMonthlyCalendarWidget = false;
				this.isMenuWeekly = false;
				this.isMenuDaily = false;
				this.isMenuDailySpecial = false;
				if (
					$(element).find(".calendar-widget").length > 0 ||
					$(element).find("event-daily").length > 0
				) {
					this.isCalendarWidget = true;
				}

				if ($(element).hasClass("widget-month-cal-v2")) {
					this.isMonthlyCalendarWidget = true;
				}
				if ($(element).find("menu-daily-widget").length) {
					this.isMenuDaily = true;
				} else if ($(element).find("menu-weekly-widget").length) {
					this.isMenuWeekly = true;
				} else if ($(element).find("menu-daily-special-widget").length) {
					this.isMenuDailySpecial = true;
				}
			} else {
				this.isCalendarWidget = false;
				this.isWidget = false;
			}

			if ($(element).hasClass("image-obj")) {
				this.isImg = true;
			} else {
				this.isImg = false;
			}

			if ($(element).hasClass("line")) {
				this.isLine = true;
			} else {
				this.isLine = false;
			}

			if ($(element).hasClass("text-box")) {
				this.isText = true;
				let textBox = $(element).find(".text")[0];
				if (!$(element).hasClass("text-box__resized")) {
					$(element).css("height", "auto");
				}
			} else {
				this.isText = false;
			}

			if ($(element).hasClass("shape")) {
				this.isShape = true;

				if ($(element).has("circle").length) {
					this.isCircle = true;
				} else {
					this.isCircle = false;
				}
			} else {
				this.isShape = false;
				this.isCircle = false;
			}

			if ($(element).find(".external-widget").length > 0) {
				this.isExternalWidget = true;
				this.editingText = true;
			} else {
				this.isExternalWidget = false;
				this.editingText = false;
			}

			this.selectElement(element);
		}
	}

	clearCurrent() {
		if (this.currentSelected !== null) {
			if (this.currentSelected !== this.currentSlide) {
				this.disableResize(this.currentSelected);
				this.disableDrag(this.currentSelected);
			}

			if ($(this.currentSelected).hasClass("text-box")) {
				let textComponent = $(this.currentSelected).find(".cke_editable")[0];
				if (textComponent) {
					textComponent.blur();
				}
			}

			if ($(this.currentSelected).hasClass("widget-obj")) {
				if (
					$(this.currentSelected).find(".calendar-widget") ||
					$(element).find("event-daily").length > 0
				) {
					$("#datepicker").datepicker("destroy");
				}
			}

			$(this.currentSelected).removeClass("selected");
			this.currentSelected = null;
			this.$rootScope.$broadcast("elementUnselected", null);
			this.redraw();
		}
	}

	enableDrag(obj) {
		let zoomFactor =
			parseFloat(this.originalZoomScale) * parseFloat(this.zoomScale);
		$(obj).css("position", "absolute");
		$(obj).draggable({
			opacity: 0.7,
			start: (event, ui) => {
				ui.position.left = 0;
				ui.position.top = 0;
			},
			drag: (event, ui) => {
				let changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
				let newLeft = ui.originalPosition.left + changeLeft / zoomFactor; // adjust new left by our zoomScale
				let changeTop = ui.position.top - ui.originalPosition.top; // find change in top
				let newTop = ui.originalPosition.top + changeTop / zoomFactor; // adjust new top by our zoomScale

				ui.position.left = newLeft;
				ui.position.top = newTop;
			},
			scroll: false,
			stop: () => {
				this.saveState();
			},
		});
	}

	enableResize(obj) {
		let container = "";
		let widgetEl = $(this.currentSelected)[0].children[0];
		if ($(obj).hasClass("widget-obj") || $(obj).hasClass("text-box")) {
			container = "#grid";
		}

		if ($(obj).hasClass("line")) {
			let line = $(obj).children()[0];

			$(obj).append(
				'<div class="ui-resizable-handle ui-resizable-e"></div> \
        <div class="ui-resizable-handle ui-resizable-w"></div>',
			);

			$(obj).resizable({
				handles: {
					e: ".ui-resizable-e",
					w: ".ui-resizable-w",
				},
				resize: (event, ui) => {
					this.resizeLine(obj, container, event, ui);
				},
				containment: container,
				stop: () => {
					this.$rootScope.$broadcast("reloadWidget", widgetEl);
					this.saveState();
					this.resetDragResize();
				},
			});
		} else if ($(obj).hasClass("text-box")) {
			$(obj).append(
				'<div class="ui-resizable-handle ui-resizable-e"></div> \
      <div class="ui-resizable-handle ui-resizable-w"></div>',
			);
			this.resizeHandle();
			$(obj).resizable({
				handles: {
					e: ".ui-resizable-e",
					w: ".ui-resizable-w",
				},
				resize: (event, ui) => {
					this.resizeLine(obj, container, event, ui);
				},
				containment: container,
				stop: () => {
					this.disableResize(this.currentSelected);
					this.saveState();
					this.resetDragResize();
				},
			});
		} else {
			$(obj).append(
				'<div class="ui-resizable-handle ui-resizable-n"></div> \
        <div class="ui-resizable-handle ui-resizable-e"></div> \
        <div class="ui-resizable-handle ui-resizable-s"></div> \
        <div class="ui-resizable-handle ui-resizable-w"></div> \
        <div class="ui-resizable-handle ui-resizable-ne"></div> \
        <div class="ui-resizable-handle ui-resizable-se"></div> \
        <div class="ui-resizable-handle ui-resizable-sw"></div> \
        <div class="ui-resizable-handle ui-resizable-nw"></div>',
			);

			var options = {
				handles: {
					n: ".ui-resizable-n",
					e: ".ui-resizable-e",
					s: ".ui-resizable-s",
					w: ".ui-resizable-w",
					ne: ".ui-resizable-ne",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					nw: ".ui-resizable-nw",
				},
				resize: (event, ui) => {
					this.resizeObject(obj, container, event, ui);
				},
				stop: () => {
					this.$rootScope.$broadcast("reloadWidget", widgetEl);
					this.disableResize(this.currentSelected);
					this.saveState();
					this.resetDragResize();
				},
			};

			options.minHeight = $(this.currentSelected)
				.css("min-height")
				.replace("px", "");
			options.minWidth = $(this.currentSelected)
				.css("min-width")
				.replace("px", "");

			let ratio = parseFloat(
				$(obj).find(":first-child").attr("data-aspectratio"),
			);
			if (isNumber(ratio)) {
				options.aspectRatio = ratio;
			}

			$(obj).resizable(options);
			this.$rootScope.$broadcast("resized");
		}

		this.resizeHandle();
	}

	resizeHandle() {
		var canvasScale = $(".slides").attr("scale");
		let handleFactor = 15;

		$(".ui-resizable-handle").css(
			"height",
			handleFactor / this.zoomScale / canvasScale,
		);
		$(".ui-resizable-handle").css(
			"width",
			handleFactor / this.zoomScale / canvasScale,
		);
	}

	resizeObject(obj, container, event, ui) {
		if ($(obj).hasClass("text-box")) {
			$(obj).addClass("text-box__resized");
		}
		let containerTop, containerLeft, containerBottom, containerRight;

		if (container != "") {
			containerTop = $(container).position().top;
			containerLeft = $(container).position().left;
			containerBottom =
				$(container).innerHeight() - $(container).position().top;
			containerRight = $(container).innerWidth() - $(container).position().left;
		}

		let axis = $(this.currentSelected).data("ui-resizable").axis;
		let aspectRatio = $(obj).resizable("option", "aspectRatio");

		var newLeft, newBottom, newRight, newTop, newHeight, newWidth;

		let zoomFactor =
			parseFloat(this.originalZoomScale) * parseFloat(this.zoomScale);

		var changeWidth = (ui.size.width - ui.originalSize.width) / zoomFactor;
		var changeHeight = (ui.size.height - ui.originalSize.height) / zoomFactor;

		newWidth = ui.originalSize.width + changeWidth;

		if (isNaN(aspectRatio)) {
			newHeight = ui.originalSize.height + changeHeight;
		} else {
			newHeight = newWidth / aspectRatio;
		}	

		if (axis == "w" || axis == "sw" || axis == "nw") {
			newLeft = ui.originalPosition.left - changeWidth;
		}

		if (axis == "n" || axis == "nw" || axis == "ne") {
			newTop = ui.originalPosition.top - changeHeight;
		}

		if (axis == "s" || axis == "sw" || axis == "se") {
			newBottom = newHeight + ui.originalPosition.top;
		}

		if (axis == "se" || axis == "ne" || axis == "e") {
			newRight = newWidth + ui.originalPosition.left;
		}

		//stop widgets and text from being resized beyond the container
		if ($(obj).hasClass("widget-obj") || $(obj).hasClass("text-box")) {
			newTop = newTop < containerTop ? containerTop : newTop;
			newLeft = newLeft < containerLeft ? containerLeft : newLeft;
			if (newBottom > containerBottom) {
				newHeight = containerBottom - ui.originalPosition.top;
				newWidth = newHeight * aspectRatio;
			} else if (newRight > containerRight) {
				newWidth = containerRight - ui.originalPosition.left;
				newHeight = newWidth / aspectRatio;
			}
		}
		ui.position.left = newLeft;
		ui.position.top = newTop;
		ui.size.width = newWidth;
		ui.size.height = newHeight;

		this.$rootScope.$broadcast("resized");
	}

	resizeLine(obj, container, event, ui) {
		let zoomFactor =
			parseFloat(this.originalZoomScale) * parseFloat(this.zoomScale);

		let axis = $(this.currentSelected).data("ui-resizable").axis;

		var changeWidth = (ui.size.width - ui.originalSize.width) / zoomFactor;
		ui.size.width = ui.originalSize.width + changeWidth;
		if (axis == "w") {
			ui.position.left = ui.originalPosition.left - changeWidth;
		}
		if ($(obj).hasClass("line")) {
			let lineContainer = $(".selected #svg-line");
			let line = $(lineContainer).children()[0];
			$(line).attr("x2", ui.size.width);
		}
	}

	setWidgetIcon(height, width) {
		let size;
		if (height < width) {
			size = height * 0.1;
		} else {
			size = width * 0.1;
		}
		$(".selected .widget__div--text")[0].style.fontSize = size + "px";
	}

	snap(ui, obj) {
		var snapTolerance = 25;
		var guides = {};
		var width = ui.helper.outerWidth();

		if ($(obj).hasClass("line")) {
			var height = ui.helper.outerHeight() / 2.5;
		} else {
			var height = ui.helper.outerHeight();
			var topRemainder = ui.position.top % this.space;
		}
		var leftRemainder = ui.position.left % this.space;
		var bottomRemainder = (ui.position.top + height) % this.space;
		var rightRemainder = (ui.position.left + width) % this.space;

		if (topRemainder <= snapTolerance) {
			guides.top = ui.position.top - topRemainder;
		}
		if (bottomRemainder <= snapTolerance) {
			guides.top = ui.position.top - bottomRemainder + height;
		}
		if (leftRemainder <= snapTolerance) {
			guides.left = ui.position.left - leftRemainder;
		}

		if (rightRemainder <= snapTolerance) {
			guides.left = ui.position.left - rightRemainder + width;
		}

		this.redraw(guides);
	}

	resetDragResize() {
		this.enableDrag(this.currentSelected);
		this.enableResize(this.currentSelected);
	}

	disableDrag(obj) {
		this.enableDrag(obj);
		$(obj).draggable("destroy");
	}

	disableResize(obj) {
		this.enableResize(obj);
		$(obj).resizable("destroy");
		$(".ui-resizable-handle").remove();
	}

	formatDialog(dialog) {
		let dialogString = "";
		if (dialog.length === 1) {
			dialogString = dialog[0];
		} else if (dialog.length === 2) {
			dialogString = dialog.join(" and ");
		} else if (dialog.length > 2) {
			dialogString =
				dialog.slice(0, -1).join(", ") + ", and " + dialog.slice(-1);
		}
		return dialogString;
	}

	checkPermissions(element) {
		//Getting type of lock for dialog
		let dialog = [];

		// Disable drag

		if (
			element &&
			!this.isTemplate &&
			($(this.currentSlide).attr("data-lock-pos") == "true" ||
				$(this.currentSelected).attr("data-lock-pos") == "true")
		) {
			$(element).draggable("disable");
			dialog.push("position");
		}

		// Disable resize
		if (
			element &&
			!this.isTemplate &&
			($(this.currentSlide).attr("data-lock-size") == "true" ||
				$(this.currentSelected).attr("data-lock-size") == "true")
		) {
			$(element).resizable("disable");
			dialog.push("size");
		}

		// Disable style
		if (
			!this.isTemplate &&
			($(this.currentSlide).attr("data-lock-style") == "true" ||
				$(this.currentSelected).attr("data-lock-style") == "true")
		) {
			this.lockStyle = true;
			dialog.push("style");
		} else {
			this.lockStyle = false;
		}

		// Disable content
		if (
			!this.isTemplate &&
			($(this.currentSlide).attr("data-lock-content") == "true" ||
				$(this.currentSelected).attr("data-lock-content") == "true")
		) {
			this.lockContent = true;
			dialog.push("content");
		} else {
			this.lockContent = false;
		}

		if (dialog.length) {
			let dialogText = this.formatDialog(dialog);
			if (dialog.length == 1) {
				$(element).attr(
					"title",
					`The ${dialogText} of elements within this template is locked. You do not have the correct permissions to unlock it.`,
				);
			} else {
				$(element).attr(
					"title",
					`The ${dialogText} of elements within this template are locked. You do not have the correct permissions to unlock them.`,
				);
			}
		}
	}

	saveState() {
		let currentStack = this.currentSlideNumber - 1;
		let pageState = this.stackMap[currentStack];

		if (!pageState) {
			pageState = { stack: [] };
		}

		if (pageState.stack.length == this.maxStateStackLength) {
			pageState.stack.shift();
		}

		if (pageState.current < pageState.stack.length - 1) {
			pageState.stack = pageState.stack.splice(0, pageState.current + 1);
		}

		// Clone section to remove classes and children in memory
		let currentState = this.currentSlide.clone()[0];

		// Remove styles from element selected
		$(currentState).find(".selected").removeClass("selected");
		$(currentState).find(".ui-resizable-handle").remove();

		pageState.stack.push($(currentState)[0].outerHTML);
		pageState.current = pageState.stack.length - 1;

		this.stackMap[currentStack] = pageState;
		this.dirty = true;
	}

	selectElement(element) {
		let canvasScale = $(".slides").attr("scale");
		let handleFactor = 15;
		let selectedSize = handleFactor / this.zoomScale / canvasScale / 4;
		let selectedItemStyleId = "selectedItemStyle";

		$(element).addClass("selected");

		$(`#${selectedItemStyleId}`).remove();

		$("#content-creator").append(
			`<style id="${selectedItemStyleId}"> #content-creator .selected::after {
       outline: ${selectedSize}px dotted #48adb4 !important;
       display: block;
       width: 100%;
       height: 100%;
       position: absolute;
       top: 0;
       left: 0;
       content: "";
       pointer-events: none;
      }</style>`,
		);

		// wait for config components to load
		setTimeout(() => {
			this.$rootScope.$broadcast("elementSelected", element);
		}, 0);
	}

	updateWidgetAttributes() {
		this.dynamicAttributes.forEach((attribute) =>
			$(`[${attribute.name}]`).length
				? $(`[${attribute.name}]`).attr(attribute.name, attribute.value)
				: null,
		);
	}
}
