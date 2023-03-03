/** @format */

import { WidgetModule } from "@k4connect/content-module-widgets/app/components/widget.module.js";
import template from "./index.html";
import "../../node_modules/spectrum-colorpicker/spectrum.css";
import "../../node_modules/jquery-ui-dist/jquery-ui.min.css";
import "../../node_modules/cropperjs/dist/cropper.min.css";

import "angular-spinner";

import "url-search-params-polyfill";
// CSS
import "./styles/app.css";
import "./vendor/reveal.css";
import "./styles/modal/modal.css";
import "./vendor/bootstrap/css/bootstrap.min.css";

// JS
// import "jquery/dist/jquery.min";
import "./vendor/canvas-to-blob.min";
import "jquery-cropper";
import "bootstrap/dist/js/bootstrap.min.js";

// Importing Modules from Components Folder
import { ContentEditorModule } from "./components/content_editor/content_editor.module.js";

// Services
import ActionMenuService from "./services/action-menu.service";
import DisplayService from "./services/display.service";
import ExtBridgeService from "./services/ext-bridge.service";
import HtmlService from "./services/html.service";
import LayoutService from "./services/layout.service";
import MasterService from "./services/master.service";
import PhotoUploadService from "./services/photoupload.service";
import FeatureFlagService from "./services/feature-flag.service";
import StateSaveService from "./services/state-save.service";
import UrlService from "./services/url.service";
import HeaderPropertiesService from "./services/header-properties.service";
import ContentEditorService from "./services/content-editor.service";
import SettingsService from "./services/settings.service";
import UndoRedoService from "./services/undo-redo.service";
import CanvasService from "./services/canvas.service";
import TimezoneService from "./services/timezone.service";
import LiveWidgetUpdateService from "./services/live-widget-update.service";
import SingleSpaService from "./services/single-spa.service";

//Directives
import ZoomDirective from "./directives/zoom-directive.js";

//Constant
import CredentialsConstant from "./constants/credentials.constant.js";

import { EditorComponentConfig } from "./components/content_editor/editor/editor.component";
import moment from "moment";

const app = angular
	.module("contentEditorApp", [
		"ui.router",
		"ui.bootstrap",
		ContentEditorModule,
		WidgetModule,
		"angularSpinner",
	])
	.constant("CachedCredentials", CredentialsConstant);

app
	.config(function (
		$stateProvider,
		$urlRouterProvider,
		$sceProvider,
		$sceDelegateProvider,
		$httpProvider,
	) {
		$sceProvider.enabled(false);

		$sceDelegateProvider.resourceUrlWhitelist(["http://localhost:5000/**"]);

		$urlRouterProvider.otherwise("/");

		$stateProvider.state("home", {
			url: "/",
			template: `<display-content-creator/>`,
		});
		$httpProvider.defaults.withCredentials = true;
	})
	.run(
		(
			$rootScope,
			htmlService,
			masterService,
			featureFlagService,
			settingsService,
			layoutService,
			canvasService,
			singleSpaService,
			timezoneService,
		) => {
			getCredentials();
			callUrlParams(masterService);
			featureFlagInit(featureFlagService);
			loadSettingsAndTemplates(
				settingsService,
				layoutService,
				canvasService,
				$rootScope,
			);
			loadDocument(htmlService, $rootScope);
			singleSpaInit(singleSpaService);
			timezoneService.setDefaultTimezone();
		},
	);

//SERVICES//
app.service("actionMenuService", ActionMenuService);
// app.service("authService", AuthService);
app.service("displayService", DisplayService);
app.service("extBridgeService", ExtBridgeService);
app.service("htmlService", HtmlService);
app.service("masterService", MasterService);
app.service("photoUploadService", PhotoUploadService);
app.service("stateService", StateSaveService);
app.service("layoutService", LayoutService);
app.service("urlService", UrlService);
app.service("headerPropertiesService", HeaderPropertiesService);
app.service("featureFlagService", FeatureFlagService);
// app.service("httpInterceptorService", HttpInterceptorService);
app.service("contentEditorService", ContentEditorService);
app.service("settingsService", SettingsService);
app.service("undoRedoService", UndoRedoService);
app.service("canvasService", CanvasService);
app.service("timezoneService", TimezoneService);
app.service("liveWidgetUpdateService", LiveWidgetUpdateService);
app.service("singleSpaService", SingleSpaService);

//COMPONENTS//
// app.component("authComponent", AuthComponentConfig);
app.component("editorToolbox", EditorComponentConfig);

//DIRECTIVES
app.directive("zoom", [
	"contentEditorService",
	(contentEditorService) => new ZoomDirective(contentEditorService),
]);

app.directive("loadStyles", [
	() => {
		{
			return {
				link: ($component, $el) => {
					const sources = [
						{
							href: "https://use.fontawesome.com/releases/v5.1.0/css/all.css",
							integrity:
								"sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt",
							crossorigin: "anonymous",
						},
						{
							href: "https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css",
						},
						{
							href: "https://fonts.googleapis.com/icon?family=Material+Icons",
						},
						{
							href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap",
						},
						{
							href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
						},
					];

					sources.forEach((src) => {
						const link = $("<link>");
						src.rel = "stylesheet";
						src.type = "text/css";

						Object.entries(src).forEach(([attr, value]) => {
							link.attr(attr, value);
						});

						$el.prepend(link);
					});
				},
			};
		}
	},
]);

app.directive("loadScripts", [
	() => {
		return {
			link: ($component, $el) => {
				const sources = [
					{
						src: "https://cdn.ckeditor.com/4.9.2/full/ckeditor.js",
					},
				];

				sources.forEach((source) => {
					const script = $("<script>");
					script.attr("src", source.src);
					script.attr("integrity", source.integrity);
					script.attr("crossorigin", source.crossorigin);

					$el.prepend(script);
				});
			},
		};
	},
]);

app.directive("displayContentEditor", [
	() => {
		return {
			restrict: "E",
			template,
		};
	},
]);

function callUrlParams(masterService) {
	masterService.getUrlParams();
}

function getCredentials() {
	let urlParams = new URLSearchParams(window.location.search);

	let cachedCredentials = {
		guid: urlParams.get("user"),
		communityId: urlParams.get("communityId"),
		communityName: urlParams.get("communityName"),
		documentId: urlParams.get("documentId"),
	};
	localStorage.setItem("cachedCredentials", JSON.stringify(cachedCredentials));
}

async function loadDocument(htmlService, $rootScope) {
	let urlParams = new URLSearchParams(window.location.search);
	if (urlParams.get("documentId")) {
		await htmlService.loadDocument(urlParams.get("documentId"));
		$rootScope.$broadcast("canvasInitialized");
	}
}

async function loadSettingsAndTemplates(
	settingsService,
	layoutService,
	canvasService,
	$rootScope,
) {
	await settingsService.getSettings();

	await layoutService.fetchLayouts();
	canvasService.loadCanvas();
	$rootScope.$broadcast("canvasInitialized");
}

function featureFlagInit(featureFlagService) {
	featureFlagService.init();
}

function singleSpaInit(singleSpaService) {
	singleSpaService.containerInit();
	singleSpaService.checkDirtyStateBeforeLeave();
}
