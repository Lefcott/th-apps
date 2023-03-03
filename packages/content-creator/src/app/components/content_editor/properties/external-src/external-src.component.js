'use strict';

import template from './external-src.component.html';

const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

export class ExternalSrcInputComponent {

	static get $inject() {
		return ['$scope', '$http', 'urlService', 'masterService', '$rootScope', '$compile', 'liveWidgetUpdateService'];
	}

	constructor($scope, $http, urlService, masterService, $rootScope, $compile, liveWidgetUpdateService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$http = $http;
		this.$compile = $compile;
		this.urlService = urlService;
		this.masterService = masterService;
		this.liveWidgetUpdateService = liveWidgetUpdateService;
		this.urlPattern = urlPattern;

		this.urlParams = this.masterService.getUrlParams();
    
		this.$scope.$on('elementSelected', (event, element) => {

			this.externalSrcInput = $(element).children()[0];

			if($(this.externalSrcInput).prop("tagName") === 'EXTERNAL-WIDGET') {

				if(!$(this.externalSrcInput).attr('src')) {
					this.srcUrl = null;
					this.updateUrl();
				} else if( $(this.externalSrcInput).attr('src') && !this.srcUrl){
					this.srcUrl = $(this.externalSrcInput).attr('src')
				} else {

					this.srcUrl = $(this.externalSrcInput).attr('src');
				}
			}
    });
	}

	updateUrl($event) {
		let widgetEl = angular.element(this.externalSrcInput)

		if(!this.srcUrl) {
			widgetEl.attr('style', 'visibility: hidden');
		} else {

			widgetEl.attr('style', 'visibility: visible');
		}

		this.liveWidgetUpdateService.update.cancel();

		
		widgetEl.attr('src', this.srcUrl);
		
		 this.liveWidgetUpdateService.update = this.liveWidgetUpdateService.debounce(() => { this.$compile(widgetEl)(this.$scope)}, 1000, {trailing: true});
		return this.liveWidgetUpdateService.update();
		
	}
	
	clearUrl(){
		this.srcUrl = null;
		this.updateUrl();
	}
}

export var ExternalSrcComponentConfig = {
	template: template,
  controller: ExternalSrcInputComponent
}