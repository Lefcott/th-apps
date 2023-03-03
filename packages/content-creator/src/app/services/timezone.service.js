/** @format */

"use strict";
const moment = require("moment-timezone");
export default class TimezoneService {
	static get $inject() {
		return ["$window", "$http", "urlService"];
	}

	constructor($window, $http, urlService) {
		this.$window = $window;
		this.$http = $http;
		this.urlService = urlService;
		this.host = this.urlService.getDocument();
	}

	async setDefaultTimezone() {
		let urlParams = new URLSearchParams(this.$window.location.search);
		this.documentId = urlParams.get("documentId");
		let params = {
			documentId: this.documentId,
			type: "none",
		};
		let url = `${this.host}/documentContent/content`;
		let response = await this.$http({
			method: "GET",
			url: url,
			headers: { Authorization: this.getToken() },
			params: params,
		});
		moment.tz.setDefault(response.data.timezone);
	}

	async getTimezone() {
		let urlParams = new URLSearchParams(this.$window.location.search);
		this.documentId = urlParams.get("documentId");
		let params = {
			documentId: this.documentId,
			type: "none",
		};
		let url = `${this.host}/documentContent/content`;
		let response = await this.$http({
			method: "GET",
			url: url,
			headers: { Authorization: this.getToken() },
			params: params,
		});

		return response.data.timezone;
	}

	getToken() {
		let urlParams = new URLSearchParams(this.$window.location.search);
		return urlParams.get("authToken");
	}
}
