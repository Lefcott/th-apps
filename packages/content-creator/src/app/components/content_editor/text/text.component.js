/** @format */

"use strict";

import template from "./text.component.html";
import "./text.component.css";

import uuid from "uuid";
import isEmpty from "lodash/isEmpty";

export class TextComponent {
	static get $inject() {
		return ["contentEditorService", "$timeout"];
	}

	constructor(contentEditorService, $timeout) {
		this.contentEditorService = contentEditorService;
		this.$timeout = $timeout;
		this.activeEditor = null;
		this.activeEditorElement = null;
		this.guid = uuid.v4();
		this.updatesPending = false;
		this.editorConfig = {
			toolbar: [
				{ name: "styles", items: ["Font", "FontSize"] },
				{
					name: "basicstyles",
					items: ["Bold", "Italic", "Underline", "Strike"],
				},
				{
					name: "paragraph",
					items: [
						"NumberedList",
						"BulletedList",
						"-",
						"JustifyLeft",
						"JustifyCenter",
						"JustifyRight",
						"JustifyBlock",
					],
				},
				{ name: "colors", items: ["TextColor"] },
			],
			keystrokes: [],
			fontSize_sizes:
				"12/12px;14/14px;16/16px;24/24px;36/36px;48/48px;60/60px;72/72px;96/96px;104/104px/112/112px;128/128px;136/136px;145/145px;154/154px;163/163px;172/172px;",
			fontSize_defaultLabel: "48",
			font_defaultLabel: "Open Sans",
			fillEmptyBlocks: true,
			tabSpaces: 8,
			autoGrow_maxHeight: 1,
			title: false,
			settingsFonts: true,
			uiColor: "#48adb4",
			disableNativeSpellChecker: false,
			startupFocus: "end",
			font_names:
				"Arial/arial, Helvetica, sans-serif;" +
				"Courier New;" +
				"Georgia;" +
				"Tahoma/Tahoma, Segoe, sans-serif;" +
				"Open Sans;" +
				"Times New Roman/Times New Roman, Times, serif;" +
				"Trebuchet MS;" +
				"Roboto;",
			ignoreEmptyParagraph: true,
			fontSize_style: {
				element: "span",
				styles: { "font-size": "#(size)" },
				overrides: [
					{
						element: "font",
						attributes: { size: null },
					},
				],
			},
			font_style: {
				element: "span",
				styles: { "font-family": "#(family)" },
				overrides: [
					{
						element: "font",
						attributes: { face: null },
					},
				],
			},
		};
	}

	editorInit() {
		//sort fonts in abc order
		let fontString = this.editorConfig.font_names;
		fontString = fontString.split(";").sort();
		fontString.shift();
		fontString.push("");
		fontString = fontString.join(";");
		this.editorConfig.font_names = fontString;

		if (this.activeEditor || this.contentEditorService.lockContent) {
			return;
		}

		this.updatesPending = true;

		if (
			this.settingsFonts &&
			this.contentEditorService.settings &&
			this.contentEditorService.settings.fonts
		) {
			this.editorConfig.font_names += this.contentEditorService.settings.fonts;
			this.settingsFonts = false;
			this.sortFontNames();
		}

		let currentSelected = this.contentEditorService.currentSelected;
		let textSelectedElem = $(currentSelected).find(".text");
		let textElement = textSelectedElem[0];

		this.editorConfig.height = textSelectedElem.height();
		this.editorConfig.width = textSelectedElem.width();

		this.contentEditorService.editingText = true;

		this.activeEditorElement = textElement;
		this.activeEditorElement.setAttribute("contenteditable", "true");

		//prevent interference with drag and resize
		$(currentSelected).removeClass("selected");
		$(currentSelected).resizable("disable");
		$(currentSelected).draggable("disable");
		$(currentSelected).unbind("mousedown");

		CKEDITOR.disableAutoInline = true;

		//handle old tempaltes with this quick fix

		// Create a new inline editor for this div
		this.activeEditor = CKEDITOR.inline(textElement, this.editorConfig);

		this.activeEditor.on("instanceReady", (ev) => {
			if (isEmpty(ev.editor.getData())) {
				ev.editor.setData('<p data-placeholder="Enter Text Here"></p>');
			}

			//move the toolbar so it's not hugging the text component
			let toolbarId = ev.editor.name.replace("text-editor", "cke_text-editor");
			let toolbar = $(`#${toolbarId}`);
			let toolbarTop = parseInt(toolbar.css("top").replace("px", ""));

			toolbar.css("top", toolbarTop - 10 + "px");
		});

		// Set up a destruction function that will occur
		// when the user clicks out of the editable space
		this.activeEditor.on("blur", (ev) => {
			this.activeEditorElement.setAttribute("contenteditable", "false");

			this.$timeout(() => {
				ev.editor.destroy();
				if (isEmpty(this.activeEditor.container.$.textContent)) {
					$(this.activeEditorElement).append(
						'<p data-placeholder="Enter Text Here"></p>',
					);
				}

				this.activeEditor = null;
				this.activeEditorElement = null;
				this.contentEditorService.editingText = false;
				$(currentSelected).mousedown(
					$.proxy(
						this.contentEditorService.mouseDown,
						this.contentEditorService,
					),
				);
			}, 0);
		});

		this.activeEditor.on("change", (ev, b, c) => {
			if (this.updatesPending) {
				this.updatesPending = false;
				setTimeout(() => {
					this.contentEditorService.saveState();
					this.updatesPending = true;
				}, 1500);
			}
		});
	}
}

export var TextComponentConfig = {
	template: template,
	controller: TextComponent,
};
