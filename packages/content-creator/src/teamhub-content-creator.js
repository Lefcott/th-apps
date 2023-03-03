/** @format */

// src/angularJS/angularJS.app.js
import singleSpaAngularJS from "single-spa-angularjs";
import angular from "angular";
import "./app";

// domElementGetter is required by single-spa-angularjs
const domElementGetter = () =>
	document.getElementById("single-spa-application:@teamhub/content-creator");

const angularLifeCycles = singleSpaAngularJS({
	angular,
	domElementGetter,
	mainAngularModule: "contentEditorApp",
	uiRouter: true,
	preserveGlobal: false,
	template: "<display-content-editor/>",
});

function findStyleSheet() {
	const styleSheet = document.getElementById("creator-styles");
	return styleSheet;
}

export const bootstrap = async (props) => {
	await angularLifeCycles.bootstrap();
	const sheetToEnable = findStyleSheet();
	if (sheetToEnable) {
		sheetToEnable.disabled = false;
	}
};

export const mount = async (props) => {
	await angularLifeCycles.mount(props);
	const sheetToEnable = findStyleSheet();
	if (sheetToEnable) {
		sheetToEnable.disabled = false;
	}
};

export const unmount = (props) => {
	const sheetToDisable = findStyleSheet();
	if (sheetToDisable) {
		sheetToDisable.disabled = true;
	}

	return angularLifeCycles.unmount(props);
};
