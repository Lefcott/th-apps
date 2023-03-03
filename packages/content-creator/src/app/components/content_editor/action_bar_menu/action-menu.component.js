/** @format */

"use strict";

import template from "./action-menu.html";
import "./action-menu.css";

export class ActionMenuComponent {
	static get $inject() {
		return [
			"$scope",
			"actionMenuService",
			"layoutService",
			"htmlService",
			"urlService",
			"extBridgeService",
			"singleSpaService",
			"masterService",
		];
	}

	constructor(
		$scope,
		actionMenuService,
		layoutService,
		htmlService,
		urlService,
		extBridgeService,
		singleSpaService,
		masterService,
	) {
		this.$scope = $scope;
		this.actionMenuService = actionMenuService;
		this.layoutService = layoutService;
		this.htmlService = htmlService;
		this.extBridgeService = extBridgeService;
		this.urlService = urlService;
		this.singleSpaService = singleSpaService;
		this.masterObj = masterService.getUrlParams();
		// index for active state
		this.selectedCat = 0;

		this.populateDrawerList();
	}

	getThumbs(thumb) {
		return `${this.urlService.getDocument()}/download?filename=${this.urlService.getDocumentBucket()}/${thumb}&redirect=true`;
	}

	openMainDrawer(button) {
		const self = this;
		// catch insert, run, return
		if (button.type == "insertOptions") {
			this.singleSpaService.mount(this.singleSpaService.Parcel.InsertionModal, {
				documentId: self.masterObj.documentId,
				onSubmit(pages) {
					self.htmlService.insertPages(pages);
				},
			});
			this.actionMenuService.mainDrawer = false;
			return;
		}
		// else
		this.actionMenuService.closeActiveState();
		this.actionMenuService.mainDrawer = true;
		this.selectedCat = 0;
		if (this.actionMenuService.currentType == button.type) {
			this.actionMenuService.closeDrawer();
			this.actionMenuService.currentType = "";
		} else {
			this.actionMenuService.currentType = button.type;
			button.active = true;
		}

		// defaults
		if (this.actionMenuService.currentType == "layoutOptions") {
			this.categorySelection = this.layoutService.slideData[0].layouts;
		}
	}

	showSlideCategory(type, index) {
		// match the type and use for ng repeat of thumbnails
		this.selectedCat = index;
		for (let item of this.layoutService.slideData) {
			if (item.type == type) {
				this.categorySelection = item.layouts;
			}
		}
	}

	async populateDrawerList() {
		this.drawerItems = this.layoutService.drawerItems;
		this.$scope.$applyAsync();
	}

	async mainSwitchBoard(template) {
		this.actionMenuService.closeDrawer();

		//handle urls saved as complete urls
		template.url =
			template.url.indexOf("https://") > -1
				? template.url
				: `${this.urlService.getDocumentBucket()}/${template.url}`;
		let templateDoc = await this.htmlService.downloadDocument(template);
		this.htmlService.applyTemplate(templateDoc);
	}

	getSavedTemplates() {
		let context = this;
		this.extBridgeService.openExtWindow(
			"importPopup",
			context,
			function (data, ctx) {
				if (data) {
					ctx.htmlService.insertPages(data.data.items);
				}
			},
		);
	}
}

export var ActionMenuComponentConfig = {
	template: template,
	controller: ActionMenuComponent,
};
