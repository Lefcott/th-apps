/** @format */

"use strict";
import { useLDClient } from "@teamhub/api";

export default class FeatureFlagService {
	static get $inject() {
		return ["$http", "$log", "$rootScope", "CachedCredentials"];
	}

	constructor($http, $log, $rootScope, CachedCredentials) {
		this.$http = $http;
		this.$log = $log;
		this.$rootScope = $rootScope;
		this.cachedCredentials = new CachedCredentials().getCredentials();
		this.loggedInUser = {};
		this.flags = {};
	}

	initFlags() {
		this.flags.app_v3 = this.ldclient.variation("contentFeed", false);
		this.flags.content_v3 = this.ldclient.variation("content-3-0", false);
		this.flags.teamhub_dining = this.ldclient.variation(
			"teamhub-dining",
			false,
		);

		this.$rootScope.$applyAsync();
		this.$rootScope.$broadcast("featureFlagReady");
	}
	init() {
		try {
			this.ldclient = useLDClient();
			this.ldclient.on("ready", () => this.initFlags());
			this.ldclient.on("change", () => {
				this.initFlags();
			});
			this.initFlags();
		} catch (e) {
			this.$log.warn("Could not init launch darkly listeners", e);
		}
	}

	getClient() {
		return this.ldclient;
	}

	getFlags() {
		return this.flags;
	}
}
