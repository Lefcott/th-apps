/** @format */

"use strict";

import template from "./submit.html";
import "./submit.css";
import { getOneSearchParam, navigate, getCommunityId } from "@teamhub/api";
import moment from "moment-timezone";
export class SubmitComponent {
	static get $inject() {
		return [
			"$scope",
			"$http",
			"contentEditorService",
			"htmlService",
			"featureFlagService",
			"displayService",
			"urlService",
			"masterService",
			"$timeout",
			"$rootScope",
			"singleSpaService",
		];
	}

	constructor(
		$scope,
		$http,
		contentEditorService,
		htmlService,
		featureFlagService,
		displayService,
		urlService,
		masterService,
		$timeout,
		$rootScope,
		singleSpaService,
	) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$http = $http;
		this.$timeout = $timeout;
		this.contentEditorService = contentEditorService;
		this.htmlService = htmlService;
		this.displayService = displayService;
		this.featureFlagService = featureFlagService;
		this.urlService = urlService;
		this.masterService = masterService;
		this.masterObj = this.masterService.getUrlParams();
		this.buttonText = "Publish";
		this.printLoading = false;
		this.printError = false;
		this.$http({
			method: "GET",
			url: `${this.urlService.getDocument()}/document/${getOneSearchParam(
				"documentId",
			)}`,
			headers: {
				"Content-Type": undefined,
			},
		}).then(({ data }) => {
			this.document = data;
		});
		this.singleSpaService = singleSpaService;
		this.extOptions = {};
	}

	async checkForFlags() {
		//feature flags are ready
		this.getFeatureFlags();

		if (this.scheduleExists()) {
			const updatedDate = moment(this.document.updatedAt).format();
			const publishedDate = moment(
				Math.max.apply(
					null,
					this.document.Schedules.map((s) => moment(s.published)),
				),
			).format();
			if (this.shouldRenderRepublish()) {
				if (updatedDate > publishedDate) {
					this.buttonText = "Republish";
					$("#publishButton").css("animation", "pulse 2s infinite alternate");
				}
			}
		}

		this.$scope.$applyAsync();
	}

	$onInit() {
		if (this.document) {
			{
				this.checkForFlags();
			}
		}
		this.$rootScope.$on("featureFlagReady", () => {
			if (this.document) {
				this.checkForFlags();
			}
		});
	}

	async preview() {
		await this.saveTemplate("save", true);
		this.singleSpaService.mount(
			this.singleSpaService.Parcel.Preview,
			this.masterObj,
		);
	}

	async saveTemplate(origin, publish) {
		this.contentEditorService.clearCurrent();
		await this.htmlService.saveToServer(origin);
		if (publish && this.scheduleExists() && this.shouldRenderRepublish()) {
			$("#publishButton").css("animation", "pulse 2s infinite alternate");
		}
	}

	shouldRenderRepublish() {
		let hasSignageSchedule = Boolean(
			this.document.Schedules.find(
				({ Destination }) => Destination.type == "Risevision Display",
			),
		);
		if ((this.isAppV3 && hasSignageSchedule) || !this.isAppV3) {
			return true;
		}

		return false;
	}

	scheduleExists() {
		const schedules = this.document.Schedules;
		return schedules && schedules.length;
	}

	async openSignage() {
		await this.saveTemplate("publish");
		navigate(
			`/signage?contentId=${
				this.document.guid
			}&communityId=${getCommunityId()}`,
		);
	}

	async publishToApp() {
		await this.saveTemplate("publish");
		navigate(
			`/publisher/feed/post?contentId=${
				this.document.guid
			}&communityId=${getCommunityId()}`,
		);
	}

	async openPrintModal() {
		this.printLoading = true;

		await this.saveTemplate("publish");

		const urlRes = await this.$http({
			method: "GET",
			url: `${this.urlService.getDocument()}/documentPrint?documentId=${
				this.document.guid
			}&highres=true`,
		}).catch(() => "error");

		if (urlRes.data && urlRes.data.url) {
			this.document.url = urlRes.data.url.split("?")[0];
		} else {
			this.printError = true;
			this.$scope.$applyAsync();
			return;
		}

		const response = await this.$http({
			method: "GET",
			url: `${this.urlService.getDocument()}/download?filename=${
				this.document.url
			}`,
		}).catch(() => "error");
		this.printLoading = false;
		this.$scope.$applyAsync();

		if (response === "error") {
			this.printError = true;
			return setTimeout(() => {
				this.printError = false;
				this.$scope.$applyAsync();
			}, 5000);
		}
		if (response.data && response.data.url)
			window.open(response.data.url, "_blank");
	}

	async getFeatureFlags() {
		const flags = this.featureFlagService.getFlags();
		/* feature-flag */
		/* This feature flag manages the new flow when publishing to the app and printing */
		/* It should be deprecated once the old 2.0 app is gone, and/or all communities transition to the new content 3.0 manager*/
		this.isAppV3 = flags.app_v3;
		this.isContentV3 = flags.content_v3;
	}
}

export var SubmitComponentConfig = {
	template: template,
	controller: SubmitComponent,
};
