'use strict';

import template from './line-width.component.html';
import './line-width.component.css';

export class LineWidthComponent {
	static get $inject() {
		return ['$scope', 'contentEditorService']
	}

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on('elementSelected', (event, element) => {
      		this.lineWidth(element);
    	});
	}

	lineWidth(element) {
		let linewidthHandle = $( '#linewidth-custom-handle' );
		let opacityText = $('#calendar-opacity-text-line');
		let lineWidthDiv = $(element).find('line')[0];
		let lineWidth = parseInt($(lineWidthDiv ).css('stroke-width'));
			opacityText.text( lineWidth);
		$( '#linewidth-slider' ).slider({
			min: 5,
			max: 50,
			value: lineWidth,
			slide: function( event, ui ) {
				opacityText.text( ui.value );
				$(lineWidthDiv).css('stroke-width', ui.value);
				$('.selected.line').css('height', ui.value/1.75);
				
			}
		});
	}
	}
export var LineWidthComponentConfig = {
	template: template,
	controller: LineWidthComponent
}