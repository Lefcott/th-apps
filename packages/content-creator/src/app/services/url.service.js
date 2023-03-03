/** @format */

"use strict";

export default class UrlService {
	static get $inject() {
		return ["$window"];
	}

	constructor($window) {
		this.$window = $window;

		this.location = this.$window.location.origin;

		this.environments = {
			local: "http://localhost:9000",
			dev: "https://teamhub-dev.k4connect.com",
			test: "https://teamhub-test.k4connect.com",
			staging: "https://teamhub-staging.k4connect.com",
			prerelease: "https://teamhub-prerelease.k4connect.com",
			prod: "https://teamhub.k4connect.com",
		};

		this.dashboard = {
			local: "http://localhost:1841",
			dev: "https://dashboard-dev.k4connect.com",
			test: "https://dashboard-test.k4connect.com",
			staging: "https://dashboard-staging.k4connect.com",
			prerelease: "https://dashboard-prerelease.k4connect.com",
			prod: "https://dashboard.k4connect.com",
		};

		this.widgets = {
			local: "http://localhost:1841",
			dev: "https://widgets-dev.k4connect.com",
			test: "https://widgets-test.k4connect.com",
			staging: "https://widgets-staging.k4connect.com",
			prerelease: "https://widgets-prerelease.k4connect.com",
			prod: "https://widgets.k4connect.com",
		};

		this.api = {
			local: "https://api-staging.k4connect.com/v2",
			dev: "https://api-dev.k4connect.com/v2",
			test: "https://api-test.k4connect.com/v2",
			staging: "https://api-staging.k4connect.com/v2",
			prerelease: "https://api-prerelease.k4connect.com/v2",
			prod: "https://api.k4connect.com/v2",
		};

		this.documentBuckets = {
			local: "https://k4connect-document-staging.s3.amazonaws.com",
			dev: "https://k4connect-document-dev.s3.amazonaws.com",
			test: "https://k4connect-document-test.s3.amazonaws.com",
			staging: "https://k4connect-document-staging.s3.amazonaws.com",
			prerelease: "https://k4connect-document.s3.amazonaws.com",
			prod: "https://k4connect-document.s3.amazonaws.com",
		};

		this.teamhubs = {
			local: "https://localhost:9001",
			dev: "https://s3.amazonaws.com/apps-dev.k4connect.com/teamhub/content-creator",
			staging:
				"https://s3.amazonaws.com/apps-staging.k4connect.com/teamhub/content-creator",
			prod: "https://s3.amazonaws.com/apps.k4connect.com/teamhub/content-creator",
		};

		this.dining = {
			local: "https://dining-staging.k4connect.com",
			dev: "https://dining-dev.k4connect.com",
			staging: "https://dining-staging.k4connect.com",
			prod: "https://dining.k4connect.com",
		};
	}

	determineSource() {
		const sourceKeys = Object.keys(this.environments);
		let source;
		sourceKeys.forEach((key) => {
			if (this.environments[key] === this.location) {
				source = key;
			}
		});

		return source;
	}

	// Function for building the url based on the local storage, ect
	buildUrl(server) {
		let source = this.determineSource();

		let url = `${this.api[source]}/${server}`;

		return url;
	}

	buildDashboardUrl() {
		let source = this.determineSource();

		let url = `${this.dashboard[source]}`;

		return url;
	}

	buildWidgetUrl() {
		let source = this.determineSource();

		let url = `${this.widgets[source]}`;

		return url;
	}

	buildBucketUrl() {
		let source = this.determineSource();

		let url = `${this.documentBuckets[source]}`;

		return url;
	}

	buildDiningUrl() {
		return this.dining[this.determineSource()];
	}

	getDocument() {
		return this.buildUrl("document");
	}

	getContent() {
		return this.buildUrl("content");
	}

	getDocumentBucket() {
		return this.buildBucketUrl();
	}

	getServiceUrl() {
		return this.getDocument();
	}

	getDashboard() {
		return this.buildDashboardUrl();
	}

	getAsset() {
		return this.getDocumentBucket();
	}

	getTeamHub() {
		return this.teamhubs[this.determineSource()];
	}

	getWidgets() {
		return this.buildWidgetUrl();
	}

	getDining() {
		return this.buildDiningUrl();
	}
}
